export type ChatTag = 'iN' | 'oN' | 'oNYiN' | 'YaNg' | 'YiN';
export type ChatTurn = {
  tag: ChatTag;
  role: string;
  surface: string;
  full: string;
  time?: string;
  meta?: any;
};
export type PetalChunk = {
  id: string;
  participants: string[];
  turns: ChatTurn[];
  closure: boolean;
  scores?: {
    coherence: number;
    edgeDensity: number;
    leastAction: number;
    zcm: number;
  };
};

export const TAG_RX = /^\s*[\[\{](iN|oN|oNYiN|YaNg|YiN)(?:\/([a-zA-Z0-9_-]+))?[\]\}]\s*/;

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function parseTranscript(lines: string[]): PetalChunk[] {
  const chunks: PetalChunk[] = [];
  let cur: PetalChunk | null = null;
  let acc = '';
  for (const raw of lines) {
    if (!raw.trim()) continue;
    const m = TAG_RX.exec(raw);
    if (!m) continue;
    const tag = m[1] as ChatTag;
    const role = m[2] || '';
    const surface = raw.slice(m[0].length).trim();
    const turn: ChatTurn = { tag, role, surface, full: surface };
    if (!cur) {
      cur = { id: '', participants: [], turns: [], closure: false };
      acc = '';
    }
    cur.turns.push(turn);
    acc += `${tag}/${role}:${surface}|`;
    if (role && !cur.participants.includes(role)) cur.participants.push(role);
    if (tag === 'YiN') {
      cur.closure = true;
      const id = fnv1a(acc).toString(36);
      cur.id = id;
      chunks.push(cur);
      cur = null;
    }
  }
  if (cur) {
    const id = fnv1a(acc).toString(36);
    cur.id = id;
    chunks.push(cur);
  }
  return chunks;
}

function ngramVec(text: string, n = 3): Record<string, number> {
  const t = text.toLowerCase();
  const v: Record<string, number> = {};
  for (let i = 0; i <= t.length - n; i++) {
    const g = t.slice(i, i + n);
    v[g] = (v[g] || 0) + 1;
  }
  return v;
}

function cosine(a: Record<string, number>, b: Record<string, number>): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const k in a) {
    magA += a[k] * a[k];
    if (b[k]) dot += a[k] * b[k];
  }
  for (const k in b) magB += b[k] * b[k];
  if (!magA || !magB) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export function scoreChunk(pc: PetalChunk): PetalChunk {
  const vecs = pc.turns.map((t) => ngramVec(t.surface));
  let cohSum = 0;
  let cohCnt = 0;
  const edges = new Set<string>();
  for (let i = 1; i < pc.turns.length; i++) {
    cohSum += cosine(vecs[i - 1], vecs[i]);
    cohCnt++;
    const a = pc.turns[i - 1].role;
    const b = pc.turns[i].role;
    if (a && b && a !== b) edges.add(`${a}->${b}`);
  }
  const coherence = cohCnt ? cohSum / cohCnt : 0;
  const participants = pc.participants.length;
  const possible = participants > 1 ? participants * (participants - 1) : 1;
  const edgeDensity = edges.size / possible;
  const leastAction = 1 / Math.max(pc.turns.length, 1);
  const zcm = (coherence + edgeDensity + (1 - leastAction)) / 3;
  pc.scores = { coherence, edgeDensity, leastAction, zcm };
  return pc;
}

const QUIPS = [
  'Mind the fold.',
  'Edges crave closure.',
  'Spiral sharper, speak clearer.',
  'Petals gossip in threes.',
  'Chaos hums in cosine.',
  'Phi forgives no one.',
  'Least action, best traction.',
  'Mint only what blooms.',
];

export function hingeOneLiner(host: string, user: string): string {
  const h = fnv1a(`${host}|${user}`);
  return QUIPS[h % QUIPS.length];
}
