import React from "react";
import PhiJostleMonocle from "../phi/PhiJostleMonocle";
export default function PhiMonocleRoute(){
  return (
    <div style={{padding:12}}>
      <h3 style={{color:"#eaf2ff"}}>Phi‑Jostle Monocle (Wizard‑of‑Oz)</h3>
      <p style={{color:"#9fb4cc"}}>Upper‑left origin, bottom→top drift, clockwise spiral, teal cancel net, monocle glassfold.</p>
      <PhiJostleMonocle/>
    </div>
  );
}
