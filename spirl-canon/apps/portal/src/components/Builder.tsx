'use client';

import React from 'react';
import { schedule, type Bead, type ScheduledRecipe } from '../lib/orchestrator';
import PMBEncoder from './PMBEncoder';
import OperatorPanel from './OperatorPanel';
import { queryModules, type Module } from '../lib/registry';

const DEFAULT_PUNCH = { tStartSec: 616, tEndSec: 677 };

export default function Builder() {
  const [modules, setModules] = React.useState<Module[]>([]);
  const [search, setSearch] = React.useState('');
  const [beads, setBeads] = React.useState<Bead[]>([]);
  const [name, setName] = React.useState('Möbius Prelude');
  const [recipeId, setRecipeId] = React.useState(() =>
    `bundle-${new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19)}`
  );
  const [scheduled, setScheduled] = React.useState<ScheduledRecipe | null>(null);
  const [runLogs, setRunLogs] = React.useState<string[]>([]);

  React.useEffect(() => {
    let mounted = true;
    queryModules(search).then((rows) => {
      if (mounted) setModules(rows);
    });
    return () => {
      mounted = false;
    };
  }, [search]);

  React.useEffect(() => {
    const recipe = schedule({ id: recipeId, name, beads, punchWindow: DEFAULT_PUNCH });
    setScheduled(recipe);
    setRunLogs([]);
  }, [recipeId, name, beads]);

  const addBead = (module: Module) => {
    const inputs: Record<string, any> = {};
    module.inputs.forEach((input) => {
      inputs[input.name] = input.default ?? '';
    });
    setBeads((prev) => [
      ...prev,
      { id: `${module.id}-${prev.length + 1}`, moduleId: module.id, inputs },
    ]);
  };

  const updateBead = (index: number, key: string, value: any) => {
    setBeads((prev) => {
      const next = prev.slice();
      next[index] = { ...next[index], inputs: { ...next[index].inputs, [key]: value } };
      return next;
    });
  };

  const removeBead = (index: number) => {
    setBeads((prev) => prev.filter((_, idx) => idx !== index));
  };

  const exportRecipe = () => {
    if (!scheduled) return;
    const blob = new Blob([JSON.stringify(scheduled, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${scheduled.id || 'recipe'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunComplete = (logs: string[]) => {
    setRunLogs(logs);
  };

  return (
    <div className="builder">
      <section className="panel modules">
        <header>
          <h2>Registry</h2>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search modules"
            aria-label="Search modules"
          />
        </header>
        <ul>
          {modules.map((module) => (
            <li key={module.id}>
              <div>
                <strong>{module.name}</strong>
                <p>{module.description}</p>
              </div>
              <button type="button" onClick={() => addBead(module)}>
                Add
              </button>
            </li>
          ))}
          {modules.length === 0 && <li className="empty">Loading registry…</li>}
        </ul>
      </section>
      <section className="panel beads">
        <header>
          <h2>Recipe</h2>
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            Recipe ID
            <input value={recipeId} onChange={(event) => setRecipeId(event.target.value)} />
          </label>
          <button type="button" onClick={exportRecipe} className="btn secondary">
            Export Recipe JSON
          </button>
        </header>
        <ol>
          {beads.map((bead, index) => (
            <li key={bead.id}>
              <div className="bead-header">
                <span>
                  {index + 1}. {bead.moduleId}
                </span>
                <button type="button" onClick={() => removeBead(index)}>
                  Remove
                </button>
              </div>
              <div className="inputs">
                {Object.entries(bead.inputs).map(([key, value]) => (
                  <label key={key}>
                    {key}
                    <input
                      value={String(value)}
                      onChange={(event) => updateBead(index, key, event.target.value)}
                    />
                  </label>
                ))}
              </div>
            </li>
          ))}
          {beads.length === 0 && <li className="empty">Add modules to weave beads.</li>}
        </ol>
      </section>
      {scheduled && (
        <section className="panel preview">
          <PMBEncoder recipe={scheduled} />
          <OperatorPanel recipe={scheduled} onRunComplete={handleRunComplete} />
          {runLogs.length > 0 && (
            <aside className="logs">
              <h3>Operator Receipts</h3>
              <ul>
                {runLogs.map((line, index) => (
                  <li key={`${line}-${index}`}>{line}</li>
                ))}
              </ul>
            </aside>
          )}
        </section>
      )}
    </div>
  );
}
