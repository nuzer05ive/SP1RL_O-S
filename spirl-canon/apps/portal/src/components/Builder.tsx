import React from 'react';
import { schedule, Recipe } from '../lib/orchestrator';
import PMBEncoder from './PMBEncoder';

export default function Builder() {
  const recipe: Recipe = schedule({ id: 'r1', name: 'demo', beads: [], punchWindow: { tStartSec: 616, tEndSec: 677 } });
  return <div><PMBEncoder recipe={recipe} /></div>;
}
