import React from 'react';
import Link from 'next/link';

const steps = [
  'Compose beads with the Registry builder.',
  'Seal the φ-pinch prelude and confirm the punch window.',
  'Encode to a PMB Möbius Rainbow and save the PNG.',
  'Scan the PMB (camera or upload) to restore the recipe.',
  'Run locally or bundle for Promote → GitHub Pages.',
];

export default function Home() {
  return (
    <main className="home">
      <header>
        <h1>SP1RL Portal</h1>
        <p>
          Mobile-first PWA for composing φ recipes, rendering PMB Möbius Rainbow barcodes, and
          operating offline bundles.
        </p>
      </header>
      <nav className="cta">
        <Link href="/encode" className="btn">
          Compose &amp; Encode
        </Link>
        <Link href="/scan" className="btn secondary">
          Scan PMB
        </Link>
      </nav>
      <section className="guide">
        <h2>Rail Quickstart</h2>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="meta">Install from your browser menu to pin the portal on your phone.</p>
      </section>
    </main>
  );
}
