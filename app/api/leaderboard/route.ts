import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/server/supabase';
import { captureServerError } from '@/lib/server/sentry';
import { hasServerSupabaseEnv } from '@/lib/server/env';

const upsertSchema = z.object({
  wallet: z.string().min(2),
  username: z.string().min(1).max(64),
  credits: z.number().int().nonnegative(),
  totalSpins: z.number().int().nonnegative().optional().default(0),
});

export async function GET(req: NextRequest) {
  if (!hasServerSupabaseEnv()) {
    return NextResponse.json({ error: 'Supabase env is missing' }, { status: 503 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? 50), 1), 200);
    const offset = Math.max(Number(searchParams.get('offset') ?? 0), 0);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('leaderboard_scores')
      .select('wallet, username, credits, total_spins, updated_at')
      .order('credits', { ascending: false })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      items: data ?? [],
      pagination: { limit, offset, count: data?.length ?? 0 },
    });
  } catch (error) {
    captureServerError(error, { route: 'GET /api/leaderboard' });
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!hasServerSupabaseEnv()) {
    return NextResponse.json({ error: 'Supabase env is missing' }, { status: 503 });
  }
  try {
    const body = await req.json();
    const payload = upsertSchema.parse(body);
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from('leaderboard_scores').upsert(
      {
        wallet: payload.wallet.toLowerCase(),
        username: payload.username,
        credits: payload.credits,
        total_spins: payload.totalSpins,
      },
      { onConflict: 'wallet' }
    );
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    captureServerError(error, { route: 'POST /api/leaderboard' });
    return NextResponse.json({ error: 'Failed to upsert leaderboard' }, { status: 400 });
  }
}
