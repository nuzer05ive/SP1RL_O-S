<template>
  <svg viewBox="0 0 400 600">
    <g>
      <!-- 12 rays (r₃), φ-thick, 1 outburst (r₄) extra thick -->
      <line v-for="i in 12" :x1="200" :y1="350"
            :x2="200+180*Math.sin(phiAngle(i))"
            :y2="550-180*Math.cos(phiAngle(i))"
            :stroke-width="i===outburst ? 10 : 4"
            stroke="#fff"/>
      <!-- hidden circle, horizon -->
      <ellipse cx="200" cy="550" rx="95" ry="20" fill="none" stroke="#fff" stroke-width="4"/>
    </g>
  </svg>
</template>
<script>
const PHI = 1.61803398875;
export default {
  props: ['outburst'],
  methods: {
    phiAngle(i) { return Math.PI * (2 - PHI) * i; }
  }
}
</script>
