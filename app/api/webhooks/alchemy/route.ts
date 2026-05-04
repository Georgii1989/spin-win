import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/server/supabase';
import { captureServerError } from '@/lib/server/sentry';
import { hasServerSupabaseEnv } from '@/lib/server/env';
import { isAllowedWebhookIp, verifyAlchemySignature } from '@/lib/server/webhook';

const activitySchema = z.object({
  hash: z.string().optional(),
  fromAddress: z.string().optional(),
  toAddress: z.string().optional(),
  value: z.number().or(z.string()).optional(),
  asset: z.string().optional(),
  category: z.string().optional(),
});

const webhookPayloadSchema = z.object({
  event: z
    .object({
      activity: z.array(activitySchema).optional(),
    })
    .optional(),
});

function parseAmount(value: number | string | undefined): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export async function POST(req: NextRequest) {
  if (!hasServerSupabaseEnv()) {
    return NextResponse.json({ error: 'Supabase env is missing' }, { status: 503 });
  }

  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    if (!isAllowedWebhookIp(ip)) {
      return NextResponse.json({ error: 'Forbidden IP' }, { status: 403 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get('x-alchemy-signature');
    if (!verifyAlchemySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const parsedJson = JSON.parse(rawBody);
    const payload = webhookPayloadSchema.parse(parsedJson);
    const activity = payload.event?.activity ?? [];

    const supabase = getSupabaseAdmin();

    for (const item of activity) {
      const amount = parseAmount(item.value);
      const wallet = (item.toAddress ?? item.fromAddress ?? '').toLowerCase();
      const txHash = item.hash ?? crypto.randomUUID();
      const eventType = item.category ?? 'unknown';

      const { error: eventError } = await supabase.from('chain_events').upsert(
        {
          tx_hash: txHash,
          wallet,
          amount,
          token_symbol: item.asset ?? null,
          event_type: eventType,
          payload: item,
        },
        { onConflict: 'tx_hash' }
      );
      if (eventError) throw eventError;

      if (wallet) {
        const { data: existing, error: fetchError } = await supabase
          .from('leaderboard_scores')
          .select('credits, total_spins, username')
          .eq('wallet', wallet)
          .maybeSingle();
        if (fetchError) throw fetchError;

        const credits = Math.max(0, Math.floor((existing?.credits ?? 0) + amount));
        const totalSpins = (existing?.total_spins ?? 0) + 1;

        const { error: upsertError } = await supabase.from('leaderboard_scores').upsert(
          {
            wallet,
            username: existing?.username ?? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`,
            credits,
            total_spins: totalSpins,
          },
          { onConflict: 'wallet' }
        );
        if (upsertError) throw upsertError;
      }
    }

    return NextResponse.json({ ok: true, processed: activity.length });
  } catch (error) {
    captureServerError(error, { route: 'POST /api/webhooks/alchemy' });
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
