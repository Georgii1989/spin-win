import crypto from 'crypto';
import { getServerEnv } from './env';

export function verifyAlchemySignature(rawBody: string, signatureHeader: string | null): boolean {
  const { ALCHEMY_WEBHOOK_SIGNING_KEY } = getServerEnv();
  if (!ALCHEMY_WEBHOOK_SIGNING_KEY) return true;
  if (!signatureHeader) return false;

  const digest = crypto.createHmac('sha256', ALCHEMY_WEBHOOK_SIGNING_KEY).update(rawBody).digest('hex');
  const normalizedIncoming = signatureHeader.replace(/^sha256=/i, '').trim();
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(normalizedIncoming));
}

export function isAllowedWebhookIp(ip: string | null): boolean {
  const { ALLOWED_WEBHOOK_IPS } = getServerEnv();
  if (!ALLOWED_WEBHOOK_IPS) return true;
  if (!ip) return false;
  const allowlist = ALLOWED_WEBHOOK_IPS.split(',').map((v) => v.trim()).filter(Boolean);
  return allowlist.includes(ip);
}
