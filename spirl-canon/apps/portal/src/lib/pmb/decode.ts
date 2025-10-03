import { PMBPayload } from '../../../../packages/core/src/pmbAssign';

const PMB_TAG = 'PMB:';
const GRID_COLS = 48;
const GRID_ROWS = 48;
const GRID_CELL = 10;
const GRID_MARGIN = 48;

function base64Decode(data: string): string {
  if (typeof atob === 'function') {
    return decodeURIComponent(escape(atob(data)));
  }
  const NodeBuffer = (globalThis as unknown as { Buffer?: { from(data: string, encoding: string): { toString(enc: string): string } } }).Buffer;
  if (NodeBuffer?.from) {
    return NodeBuffer.from(data, 'base64').toString('utf8');
  }
  throw new Error('No base64 decoder available');
}

export async function decodePMB(source: Blob | File): Promise<PMBPayload> {
  const buffer = await source.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  try {
    return decodePMBBytes(bytes);
  } catch (error) {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([bytes], { type: 'image/png' });
      return decodeFromCanvas(blob);
    }
    throw error;
  }
}

export function decodePMBBytes(bytes: Uint8Array): PMBPayload {
  const text = new TextDecoder('latin1').decode(bytes);
  const idx = text.lastIndexOf(PMB_TAG);
  if (idx >= 0) {
    const raw = text.slice(idx + PMB_TAG.length).replace(/\0+$/, '');
    const json = base64Decode(raw);
    return JSON.parse(json);
  }
  throw new Error('PMB payload not found');
}

async function decodeFromCanvas(blob: Blob): Promise<PMBPayload> {
  const image = await loadImage(blob);
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('PMB payload not found');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const lengthHigh = sampleCell(ctx, canvas.width, canvas.height, 0);
  const lengthLow = sampleCell(ctx, canvas.width, canvas.height, 1);
  const charCount = (lengthHigh << 8) | lengthLow;
  if (!charCount) throw new Error('PMB payload not found');
  const chars: string[] = [];
  for (let index = 0; index < charCount; index += 1) {
    const value = sampleCell(ctx, canvas.width, canvas.height, index + 2);
    chars.push(String.fromCharCode(value));
  }
  const base64 = chars.join('');
  const json = base64Decode(base64);
  return JSON.parse(json);
}

function sampleCell(ctx: CanvasRenderingContext2D, width: number, height: number, index: number): number {
  const col = index % GRID_COLS;
  const row = Math.floor(index / GRID_COLS);
  if (row >= GRID_ROWS) return 0;
  const x = GRID_MARGIN + col * GRID_CELL + GRID_CELL / 2;
  const y = height - GRID_MARGIN - GRID_ROWS * GRID_CELL + row * GRID_CELL + GRID_CELL / 2;
  const data = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
  const brightness = (data[0] + data[1] + data[2]) / 3;
  return Math.max(0, Math.min(255, Math.round(brightness)));
}

async function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    img.src = url;
  });
}
