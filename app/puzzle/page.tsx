'use client'
import dynamic from 'next/dynamic';

// Import CrosswordGame with no SSR
const CrosswordGame = dynamic(() => import('../components/CrosswordGame'), {
  ssr: false
});

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <CrosswordGame />
    </main>
  );
}