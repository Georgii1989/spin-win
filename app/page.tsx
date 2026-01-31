'use client';

import { SlotMachine } from '@/components/slot/SlotMachine';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <SlotMachine />
    </main>
  );
}