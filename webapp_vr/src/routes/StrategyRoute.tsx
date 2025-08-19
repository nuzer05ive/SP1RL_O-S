import React from "react";
import StrategyBoard from "../components/StrategyBoard";
export default function StrategyRoute(){
  return (
    <div style={{padding:12}}>
      <h3 style={{color:"#eaf2ff"}}>Jostle Planner — Passive Streams Strategist</h3>
      <p style={{color:"#9fb4cc"}}>Seed → concept graph → beam search → top strategies (Profit/Effort/TTF/Risk/Leverage/Harmony)</p>
      <StrategyBoard/>
    </div>
  );
}
