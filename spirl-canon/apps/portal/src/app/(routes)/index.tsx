import React from 'react';
import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <h1>SP1RL Portal</h1>
      <nav>
        <Link href="/encode">Encode</Link>
        <Link href="/scan">Scan</Link>
      </nav>
    </main>
  );
}
