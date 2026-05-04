import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { log } from '@/lib/server/logger';

const errorSchema = z.object({
  message: z.string().min(1),
  stack: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = errorSchema.parse(await req.json());
    log('error', 'client_error', payload);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
