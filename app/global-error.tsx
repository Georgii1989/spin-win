'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void fetch('/api/monitor/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'global-error',
        message: error.message,
        stack: error.stack,
      }),
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold text-red-400">Something went wrong</h1>
          <p className="mt-3 text-sm text-white/70">{error.message}</p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
