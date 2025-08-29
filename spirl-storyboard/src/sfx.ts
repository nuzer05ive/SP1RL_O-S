export type SfxCue = "BELL_TOLL"|"SEAGULLS"|"FOG_HORN"|"CLAP"|"CONFETTI_POP"|"LAUGH";

const SFX: Record<SfxCue, { label: string; dur: number }> = {
  BELL_TOLL:   { label: "🔔 BeLL TOLL DONG DONG", dur: 1.6 },
  SEAGULLS:    { label: "🕊️ Seagull caws", dur: 1.2 },
  FOG_HORN:    { label: "📣 Fog horn", dur: 1.8 },
  CLAP:        { label: "👏 Clapping", dur: 1.5 },
  CONFETTI_POP:{ label: "🎉 Confetti pops", dur: 1.2 },
  LAUGH:       { label: "😂 Laughter", dur: 1.7 }
};

export function resolveSfx(names: string[]){
  return names.map(n => (SFX[n as SfxCue] || { label: n, dur: 1.0 }));
}

