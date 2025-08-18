import React from 'react';
import { exportJSON, importJSON } from '../engine/IdeaStore';

export default function Exporter(){
  const handleExport = async ()=>{
    const json = await exportJSON();
    const blob = new Blob([json], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ideas.json'; a.click();
  };
  const handleImport = async (e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
    if(file){
      const text = await file.text();
      await importJSON(text);
    }
  };
  return (
    <div>
      <button onClick={handleExport}>Export JSON</button>
      <input type="file" accept="application/json" onChange={handleImport} />
    </div>
  );
}
