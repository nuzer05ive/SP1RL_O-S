<template>
  <div id="app">
    <HandHUD ref="hud" @scrub="onScrub"/>
    <a-scene vr-mode-ui="enabled: true" embedded>
      <a-entity id="seed" geometry="primitive: torusKnot; p:2; q:3; radius:1.0"
                material="color: #1fb6ff; metalness:0.5; roughness:0.2"
                position="0 1.6 -3" ring-controls></a-entity>
      <a-sky color="#0b0d12"></a-sky>
    </a-scene>
  </div>
</template>
<script>
import 'aframe';
import '../vr/components/RingControls'
import HandHUD from '../components/HandHUD.vue'
export default {
  components:{ HandHUD },
  methods:{
    onScrub(v){
      const z = -3 + (v-50)/50;  // granular depth scrub
      const seed = document.getElementById('seed');
      seed.setAttribute('position', {x:0, y:1.6, z});
    }
  }
}
</script>
