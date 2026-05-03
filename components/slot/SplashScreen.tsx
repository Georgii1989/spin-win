'use client';

import { type ReactElement } from 'react';
import { Crown, Sparkles, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SplashScreenProps {
  onStart: () => void;
}

export function SplashScreen({ onStart }: SplashScreenProps): ReactElement {
  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#05040d]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.35),transparent_38%),radial-gradient(circle_at_80%_25%,rgba(6,182,212,0.25),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.22),transparent_44%)]" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-8 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative z-10 mx-4 w-full max-w-2xl rounded-3xl border border-white/15 bg-black/45 p-8 text-center shadow-[0_25px_120px_rgba(6,182,212,0.25)] backdrop-blur-xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-300/35 bg-yellow-300/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">
          <Sparkles className="h-3.5 w-3.5" />
          High Stakes Experience
        </div>

        <h1 className="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-yellow-100 bg-clip-text text-4xl font-black leading-tight text-transparent md:text-6xl">
          Spin and Win
          <br />
          on Base
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm text-cyan-100/80 md:text-base">
          Neon atmosphere, dynamic jackpot action, live leaderboard and premium casino vibes.
          Enter the arena and make your profile climb to the top.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 text-left text-sm md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-cyan-100">
            <div className="mb-1 font-semibold">Live Top</div>
            <div className="text-xs text-cyan-100/70">Infinite ranking feed with top 10 pinned</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-fuchsia-100">
            <div className="mb-1 font-semibold">Jackpot Flow</div>
            <div className="text-xs text-fuchsia-100/70">Smooth spin, crisp VFX and clean HUD</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-yellow-100">
            <div className="mb-1 font-semibold">Profile Boost</div>
            <div className="text-xs text-yellow-100/70">Showcase your Base profile in-game</div>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={onStart}
            className="h-12 min-w-56 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 px-8 text-base font-bold text-white shadow-[0_0_35px_rgba(217,70,239,0.45)] transition hover:scale-[1.02] hover:from-fuchsia-400 hover:to-cyan-400"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Enter Casino
          </Button>
          <a
            href="https://base.app/profile/1x321"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-yellow-300/35 bg-yellow-300/10 px-6 text-sm font-semibold text-yellow-100 transition hover:bg-yellow-300/20"
          >
            <Crown className="h-4 w-4" />
            Base Profile @1x321
          </a>
        </div>
      </div>
    </div>
  );
}
