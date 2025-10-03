'use client';

import React from 'react';
import { mathReceipt } from '../../../../packages/core/src/receipts';
import { recipeToPMB } from '../../../../packages/core/src/pmbAssign';
import { drawPMB, exportPMBPNG } from '../lib/pmb/encode';
import type { ScheduledRecipe } from '../lib/orchestrator';

export default function PMBEncoder({ recipe }: { recipe: ScheduledRecipe }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string>('');
  const [receipt, setReceipt] = React.useState<string>('');
  const [payloadId, setPayloadId] = React.useState<string>('');

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const receiptText = recipe.receipt ?? mathReceipt();
    const payload = recipeToPMB(recipe, receiptText);
    drawPMB(canvas, payload);
    const blob = exportPMBPNG(canvas, payload);
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    setReceipt(receiptText);
    setPayloadId(payload.id);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [recipe]);

  return (
    <section className="pmb-encoder">
      <header>
        <h2>PMB Möbius Rainbow</h2>
        <p>Deterministic digest · {payloadId}</p>
        <p className="receipt">{receipt}</p>
      </header>
      <canvas ref={canvasRef} width={1200} height={1200} aria-label="PMB barcode" />
      <div className="actions">
        {downloadUrl && (
          <a href={downloadUrl} download={`${payloadId || 'recipe'}.png`} className="btn">
            Download PMB PNG
          </a>
        )}
        <p className="hint">Save to Files/Photos. The payload rides inside the PNG footer.</p>
      </div>
    </section>
  );
}
