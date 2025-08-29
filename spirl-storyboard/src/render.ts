// extremely small HTML generator for preview (no CSS/assets)
import { TimelineEvent } from "./cues";

export function renderHTML(title: string, timeline: TimelineEvent[]): string {
  const rows = timeline.map(ev => {
    const json = escapeHtml(JSON.stringify(ev.data));
    return `<div><b>[${ev.t.toFixed(1)}s]</b> <code>${ev.cue}</code><pre>${json}</pre></div>`;
  }).join("\n");
  return `<!doctype html><meta charset="utf-8"><title>${escapeHtml(title)}</title>
  <style>body{font:14px/1.4 system-ui;background:#0b1220;color:#e6efff;padding:16px}
  pre{background:#101a2c;border:1px solid #13203a;border-radius:8px;padding:8px;white-space:pre-wrap}</style>
  <h1>${escapeHtml(title)}</h1>${rows}`;
}
function escapeHtml(s: string){ return s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]!)); }
