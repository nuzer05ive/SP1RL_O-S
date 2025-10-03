'use client';

import React from 'react';
import PMBScanner from '../../components/PMBScanner';
import OperatorPanel from '../../components/OperatorPanel';
import { schedule, type ScheduledRecipe } from '../../lib/orchestrator';
import type { PMBPayload } from '../../../../packages/core/src/pmbAssign';

export default function ScanPage() {
  const [recipe, setRecipe] = React.useState<ScheduledRecipe | null>(null);

  const handleLoad = (payload: PMBPayload) => {
    const scheduled = schedule({
      id: payload.id,
      name: payload.name,
      beads: payload.beads,
      punchWindow: payload.punch,
    });
    setRecipe(scheduled);
  };

  return (
    <main className="page scan">
      <PMBScanner onLoad={handleLoad} />
      {recipe && (
        <section className="results">
          <h2>Decoded Recipe</h2>
          <pre>{JSON.stringify(recipe, null, 2)}</pre>
          <OperatorPanel recipe={recipe} />
        </section>
      )}
    </main>
  );
}
