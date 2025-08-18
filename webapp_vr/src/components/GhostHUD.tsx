import React from "react";
type Props = {
  zcm:{care:number; courage:number; trust:number};
  teal:number;
  witness:1|2|3|4|5;
  angle:number;
  epoch:number;
  primeHit:boolean;
  lockHard:boolean;
};
const names = ["","Light-fixed","Dark-fixed","Both-fixed","Both-moving","Hinge/Ironic"];
export default function GhostHUD(p:Props){
  const badge = p.lockHard ? "TEAL-LOCK" : (p.teal>=0.62 ? "TEAL+" : "DRIFT");
  return (
    <div style={{position:"absolute", right:12, top:12, background:"#0a0f15cc", color:"#eaf2ff", padding:12, border:"1px solid #1b2736", borderRadius:10, font:"12px system-ui", minWidth:240}}>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <b>SP1RL_Ghost</b><span>{badge}</span>
      </div>
      <div style={{marginTop:6}}>ZCM · care <b>{p.zcm.care.toFixed(2)}</b> · courage <b>{p.zcm.courage.toFixed(2)}</b> · trust <b>{p.zcm.trust.toFixed(2)}</b></div>
      <div>TEAL <b>{p.teal.toFixed(3)}</b> · witness <b>{names[p.witness]}</b> · θ <b>{p.angle.toFixed(3)}</b></div>
      <div>epoch <b>{p.epoch}</b> {p.primeHit ? "• sealed" : ""}</div>
    </div>
  );
}
