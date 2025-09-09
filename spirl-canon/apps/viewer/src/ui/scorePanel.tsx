import React, { useState } from 'react';

type Layers = {
  drones:boolean; pulses:boolean; ost:boolean; risset:boolean; shep:boolean;
};

const defaultLayers:Layers = { drones:true, pulses:true, ost:true, risset:true, shep:true };

export const ScorePanel:React.FC = () => {
  const [layers,setLayers] = useState<Layers>(defaultLayers);
  const [punch,setPunch] = useState(false);

  const toggle = (k:keyof Layers)=> setLayers({...layers,[k]:!layers[k]});

  return (
    <div>
      <h3>Score Layers</h3>
      {Object.keys(layers).map(k=>
        <label key={k} style={{display:'block'}}>
          <input type="checkbox" checked={layers[k as keyof Layers]} onChange={()=>toggle(k as keyof Layers)} />
          {k}
        </label>
      )}
      <div>Punch: {punch?"ready":"..."}</div>
    </div>
  );
};

export default ScorePanel;
