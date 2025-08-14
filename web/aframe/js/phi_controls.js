AFRAME.registerComponent('phi-seed', {
  schema:{},
  init(){
    const el=this.el;
    // shells
    for (let i=0;i<5;i++){
      const r=0.3*Math.pow(1.618,i);
      const c=document.createElement('a-ring');
      c.setAttribute('radius-inner', r*0.97);
      c.setAttribute('radius-outer', r);
      c.setAttribute('rotation', `${-10*i} ${36*i} 0`);
      c.setAttribute('color','#86c5da');
      el.appendChild(c);
    }
    this.state={depth:0, focus:0};
    window.addEventListener('click', ()=>this.next());
    window.addEventListener('dblclick', ()=>this.deepen());
    let holdTimer=null;
    window.addEventListener('pointerdown', ()=>{holdTimer=setTimeout(()=>this.shell(),3000)});
    window.addEventListener('pointerup', ()=>{ if(holdTimer) clearTimeout(holdTimer)});
  },
  next(){ this.state.focus=(this.state.focus+1)%5; this.updateHue(+1); },
  deepen(){ this.state.depth=Math.min(43,this.state.depth+1); this.updateHue(+3); },
  shell(){ alert("SP1RL Shell: /suggest /capture /signoff /export"); },
  updateHue(step){
    const kids=[...this.el.children];
    kids.forEach((k,i)=>{
      const h=((i*36 + this.state.depth*7 + step*13)%360);
      k.setAttribute('color', `hsl(${h},85%,62%)`);
    });
  }
});
