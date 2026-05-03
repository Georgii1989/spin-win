'use client';

import { SlotMachine } from '@/components/slot/SlotMachine';

export default function Home() {
  return (
    <main className="flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black">
      <SlotMachine />
    </main>
  );
}