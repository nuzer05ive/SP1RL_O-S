import { PMBPayload } from '../../../../packages/core/src/pmbAssign';
import { phiTicks } from '../../../../packages/core/src/pmbGlyph';

const PMB_TAG = 'PMB:';
const GRID_COLS = 48;
const GRID_ROWS = 48;
const GRID_CELL = 10;
const GRID_MARGIN = 48;

function base64Encode(json: string): string {
  if (typeof btoa === 'function') {
    return btoa(unescape(encodeURIComponent(json)));
  }
  const NodeBuffer = (globalThis as unknown as { Buffer?: { from(data: string, encoding: string): { toString(enc: string): string } } }).Buffer;
  if (NodeBuffer?.from) {
    return NodeBuffer.from(json, 'utf8').toString('base64');
  }
  throw new Error('No base64 encoder available');
}

export function payloadToBase64(payload: PMBPayload): string {
  const json = JSON.stringify(payload);
  return base64Encode(json);
}

export function serializePMBPayload(payload: PMBPayload): Uint8Array {
  const prefix = new TextEncoder().encode('PNG_STUB');
  const trailer = new TextEncoder().encode(PMB_TAG + payloadToBase64(payload));
  const bytes = new Uint8Array(prefix.length + trailer.length);
  bytes.set(prefix, 0);
  bytes.set(trailer, prefix.length);
  return bytes;
}

export function drawPMB(canvas: HTMLCanvasElement, payload: PMBPayload) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const size = 1200;
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = '#0b0f1a';
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const radius = 460;
  const ticks = phiTicks(144);
  ticks.forEach((tick, index) => {
    const angle = (tick.angleDeg * Math.PI) / 180;
    const xOuter = cx + radius * Math.cos(angle);
    const yOuter = cy + radius * Math.sin(angle);
    const innerRadius = tick.emphasis ? radius - 42 : radius - 24;
    const xInner = cx + innerRadius * Math.cos(angle);
    const yInner = cy + innerRadius * Math.sin(angle);
    ctx.strokeStyle = tick.emphasis ? '#3a4b7a' : '#223356';
    ctx.lineWidth = tick.emphasis ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(xOuter, yOuter);
    ctx.lineTo(xInner, yInner);
    ctx.stroke();
  });

  const base64 = payloadToBase64(payload);
  const characters = [...base64];
  const trackRadiusStart = 140;
  const trackRadiusEnd = radius - 80;
  const track = trackRadiusEnd - trackRadiusStart;

  characters.forEach((char, index) => {
    const ratio = index / Math.max(1, characters.length - 1);
    const radiusAtChar = trackRadiusStart + track * ratio;
    const turns = 4;
    const theta = ratio * turns * Math.PI * 2;
    const hue = (charToValue(char) / 64) * 360;
    ctx.fillStyle = `hsl(${hue} 80% 58%)`;
    const x = cx + radiusAtChar * Math.cos(theta);
    const y = cy + radiusAtChar * Math.sin(theta);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
  });

  ctx.fillStyle = '#b8c6ff';
  ctx.font = '20px ui-monospace, Menlo, monospace';
  ctx.fillText(payload.receipt, cx - 320, size - 60);
  ctx.fillText(`${payload.name} · ${payload.id}`, cx - 320, size - 30);

  encodeGrid(ctx, size, characters);
}

function charToValue(char: string): number {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  const idx = alphabet.indexOf(char);
  return idx >= 0 ? idx : 0;
}

function encodeGrid(ctx: CanvasRenderingContext2D, size: number, characters: string[]) {
  const encoded: number[] = [];
  const length = characters.length;
  encoded.push((length >> 8) & 0xff);
  encoded.push(length & 0xff);
  characters.forEach((char) => {
    encoded.push(char.charCodeAt(0));
  });
  ctx.fillStyle = 'rgba(11, 15, 26, 0.75)';
  const areaHeight = GRID_ROWS * GRID_CELL;
  ctx.fillRect(
    GRID_MARGIN - 8,
    size - GRID_MARGIN - areaHeight - 8,
    GRID_COLS * GRID_CELL + 16,
    areaHeight + 16
  );
  encoded.forEach((value, index) => {
    if (index >= GRID_ROWS * GRID_COLS) return;
    const col = index % GRID_COLS;
    const row = Math.floor(index / GRID_COLS);
    const brightness = Math.round(32 + (value / 255) * 200);
    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
    const x = GRID_MARGIN + col * GRID_CELL;
    const y = size - GRID_MARGIN - GRID_ROWS * GRID_CELL + row * GRID_CELL;
    ctx.fillRect(x, y, GRID_CELL - 2, GRID_CELL - 2);
  });
}

export function exportPMBPNG(canvas: HTMLCanvasElement, payload: PMBPayload): Blob {
  const dataUrl = canvas.toDataURL('image/png');
  const [, base64] = dataUrl.split(',');
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const trailer = new TextEncoder().encode(PMB_TAG + payloadToBase64(payload));
  const combined = new Uint8Array(binary.length + trailer.length);
  combined.set(binary, 0);
  combined.set(trailer, binary.length);
  return new Blob([combined], { type: 'image/png' });
}
