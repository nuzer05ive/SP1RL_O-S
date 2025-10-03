'use client';

import React from 'react';
import OperatorPanel from '../../../components/OperatorPanel';
import { schedule, type ScheduledRecipe } from '../../../lib/orchestrator';

export default function BundlePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [recipe, setRecipe] = React.useState<ScheduledRecipe | null>(null);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/bundles/${id}.json`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Bundle not found');
        const data = await response.json();
        if (cancelled) return;
        const scheduled = schedule(data);
        setRecipe(scheduled);
      })
      .catch((err: any) => {
        if (!cancelled) {
          setError(err.message || 'Unable to load bundle.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main className="page bundle">
      <header>
        <h1>Bundle · {id}</h1>
        <p>Offline operator shell</p>
      </header>
      {recipe && <OperatorPanel recipe={recipe} />}
      {error && <p className="error">{error}</p>}
    </main>
  );
}
