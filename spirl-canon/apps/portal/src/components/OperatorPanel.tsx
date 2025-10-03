'use client';

import React from 'react';
import type { ScheduledRecipe } from '../lib/orchestrator';
import { run, type OperatorLog } from '../lib/runtime';

export default function OperatorPanel({
  recipe,
  onRunComplete,
}: {
  recipe: ScheduledRecipe;
  onRunComplete?: (logs: string[]) => void;
}) {
  const [logs, setLogs] = React.useState<OperatorLog[]>([]);
  const [status, setStatus] = React.useState<'idle' | 'running' | 'done'>('idle');
  const online = typeof navigator === 'undefined' ? true : navigator.onLine;

  const execute = async () => {
    setStatus('running');
    const results = await run(recipe);
    setLogs(results);
    setStatus('done');
    onRunComplete?.(results.map((log) => formatLog(log)));
  };

  React.useEffect(() => {
    setStatus('idle');
    setLogs([]);
  }, [recipe]);

  return (
    <section className="operator">
      <header>
        <h2>Operator Shell</h2>
        <p>{online ? 'Offline ready · cache primed' : 'Offline · running from cache'}</p>
      </header>
      <button type="button" className="btn" onClick={execute} disabled={status === 'running'}>
        {status === 'running' ? 'Running…' : 'Run Recipe'}
      </button>
      <div className="terminal" role="log" aria-live="polite">
        {logs.length === 0 && <p>φ-pinch prelude awaits. Tap run to execute locally.</p>}
        {logs.map((log) => (
          <p key={`${log.moduleId}-${log.at}`}>{formatLog(log)}</p>
        ))}
      </div>
    </section>
  );
}

function formatLog(log: OperatorLog) {
  return `t+${log.at.toFixed(2)}s · ${log.moduleId} → ${log.detail}`;
}
