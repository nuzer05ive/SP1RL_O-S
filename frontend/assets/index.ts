// Auto-generated asset exports
export { default as Logo } from '@/public/logo_sp1rl_eye.svg';
export { default as Favicon } from '@/public/favicon.svg';
export { default as AppIcon } from '@/public/app_icon_1024.png';

export { palette } from '@/assets/colors_phi.json';
export { default as SpiralisSans } from '@/assets/fonts/SpiralisSans.woff2';
export { default as SpiralisScript } from '@/assets/fonts/SpiralisScript.woff2';

export { default as HUDRing } from '@/assets/hud/hud_ring.png';
export { default as HUDTick } from '@/assets/hud/hud_tick.svg';
export { default as HUDShimmer } from '@/assets/hud/hud_shimmer.gif';

export { default as PetalLatticeModel } from '@/assets/glyphs/petal_lattice.glb';
export { default as SuprfOverlay } from '@/assets/glyphs/suprf_overlay.webp';

export { default as HeroSpiralEye } from '@/public/hero_spiral_eye.png';
export { default as HeroPilot } from '@/public/hero_pilot.png';

export { default as CosmicGradient } from '@/assets/backgrounds/bg_cosmic_gradient.jpg';
export { default as GridDark } from '@/assets/backgrounds/bg_grid_dark.svg';

export { default as MultiverseBloom } from '@/assets/audio/multiverse_bloom.wav';
export { default as FoldedLoop } from '@/assets/audio/folded_loop_1.ogg';

export { default as SpiralIntro } from '@/assets/motion/spiral_intro.webm';
export { default as HandsModel } from '@/assets/vr/hands_sp1rl.glb';

export { default as SSSToggle } from '@/assets/ui/sss_toggle.svg';
export { default as PhiCursor } from '@/assets/ui/phi_cursor.cur';

// Episode and lens arrays
export const episodes = Array.from({ length: 221 }, (_, i) =>
  require(`@/assets/episodes/episode_${String(i + 1).padStart(3, '0')}.jpg`)
);
export const lensNodes = Array.from({ length: 89 }, (_, i) =>
  require(`@/assets/lenses/lens_node_${String(i).padStart(2, '0')}.svg`)
);
