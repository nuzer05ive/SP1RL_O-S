AFRAME.registerComponent('ring-controls', {
  schema: { speed:{default:1.0}, gain:{default:0.5} },
  init() {
    this.state = { dragging:false, x:0, y:0, z:0, pinch:false };
    const el = this.el;
    // mobile gestures
    el.sceneEl.canvas.addEventListener('touchstart', e => {
      this.state.dragging = true;
      this.state.x = e.touches[0].clientX;
      this.state.y = e.touches[0].clientY;
    }, {passive:true});
    el.sceneEl.canvas.addEventListener('touchmove', e => {
      if(!this.state.dragging) return;
      const dx = (e.touches[0].clientX - this.state.x)/window.innerWidth;
      const dy = (e.touches[0].clientY - this.state.y)/window.innerHeight;
      this.rotate(dx, dy);
      this.state.x = e.touches[0].clientX;
      this.state.y = e.touches[0].clientY;
    }, {passive:true});
    el.sceneEl.canvas.addEventListener('touchend', ()=>{ this.state.dragging=false; });
    // wheel scrub (desktop)
    el.sceneEl.canvas.addEventListener('wheel', e=>{
      this.scrub(e.deltaY>0?1:-1);
    }, {passive:true});
  },
  rotate(dx, dy){
    const r = this.el.object3D.rotation;
    r.y -= dx * this.data.speed;
    r.x -= dy * this.data.speed;
  },
  scrub(sgn){
    const p = this.el.getAttribute('position');
    this.el.setAttribute('position', {x:p.x, y:p.y, z:p.z + sgn*this.data.gain});
  }
});
