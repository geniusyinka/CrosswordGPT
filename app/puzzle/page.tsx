// src/app/page.tsx
import CrosswordGame from '../components/CrosswordGame';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <CrosswordGame />
    </main>
  );
}