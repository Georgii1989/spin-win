# Operations Checklist

## Vercel Environment Variables

Set these in Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALCHEMY_WEBHOOK_SIGNING_KEY` (optional but recommended)
- `ALLOWED_WEBHOOK_IPS` (optional CSV allowlist)
- `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` (optional)

## Supabase Setup

1. Open Supabase SQL editor.
2. Run `supabase/schema.sql`.
3. Verify tables:
   - `leaderboard_scores`
   - `chain_events`

## Webhooks

- Endpoint: `POST /api/webhooks/alchemy`
- Signature header supported: `x-alchemy-signature` (`sha256=<hex>` or `<hex>`)
- Optional IP allowlist uses `ALLOWED_WEBHOOK_IPS`.

## Monitoring

- Health endpoint: `GET /api/health`
- Client global errors: posted to `POST /api/monitor/error`
- CI workflow runs lint + typecheck + build on every push/PR.
