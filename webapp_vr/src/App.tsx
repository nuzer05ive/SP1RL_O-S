import React, { useEffect } from "react";
import StrategyRoute from "./routes/StrategyRoute";
import GhostCLI from "./components/GhostCLI";
import BiasPanel from "./components/BiasPanel";
export default function App(){
  useEffect(()=>{
    (window as any).__SP1RL_LOCAL__ = { route:"Strategy", epoch:0, node:"phi43:seed" };
    (window as any).__SP1RL_GLOBAL__ = { repo:"SP1RL_O-S", branches:68, witnesses:[1,2,3,4,5] };
  },[]);
  return (
    <div style={{width:"100%",height:"100%",background:"#060a10"}}>
      <StrategyRoute/>
      <GhostCLI/>
      <BiasPanel/>
    </div>
  );
}
