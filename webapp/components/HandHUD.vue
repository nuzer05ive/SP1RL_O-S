<template>
  <div class="hud">
    <div class="rail">
      <span>φ-seed</span>
      <span>{{ status }}</span>
    </div>
    <div class="scrubber">
      <input type="range" min="0" max="100" v-model.number="scrub"
             @input="$emit('scrub', scrub)" />
    </div>
  </div>
</template>
<script>
export default {
  emits: ['scrub'],
  data(){ return { scrub: 0, status: 'idle' } },
  methods:{ setStatus(s){ this.status=s } }
}
</script>
<style>
.hud{position:fixed;left:0;right:0;bottom:0;background:#101317aa;
     color:#eef;padding:.6rem .8rem;font:600 14px/1.3 system-ui;}
.rail{display:flex;justify-content:space-between}
.scrubber input{width:100%}
</style>
