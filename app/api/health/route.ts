import { NextResponse } from 'next/server';
import { hasServerSupabaseEnv } from '@/lib/server/env';

export async function GET() {
  return NextResponse.json({
    ok: true,
    ts: new Date().toISOString(),
    env: {
      supabaseConfigured: hasServerSupabaseEnv(),
    },
  });
}
