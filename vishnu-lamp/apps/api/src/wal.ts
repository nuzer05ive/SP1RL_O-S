import { promises as fs } from 'fs';
import { WalEvent } from '@vishnu/core';

const WAL_PATH = new URL('../../data/wal.log', import.meta.url);

export async function append(event: WalEvent): Promise<void> {
  await fs.appendFile(WAL_PATH, JSON.stringify(event) + '\n');
}

export async function readAll(): Promise<WalEvent[]> {
  try {
    const data = await fs.readFile(WAL_PATH, 'utf-8');
    return data
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}
