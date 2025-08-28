import React, { useState } from "react";
import { apiUpload } from "./lib/api";

export default function App(){
  const [scan, setScan] = useState<any>(null);
  async function handleFile(e:React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0];
    if(!file) return;
    const res = await apiUpload(file);
    setScan(res);
  }
  return (
    <div>
      <h1>SP1RL-Q.us Story Synth</h1>
      <input type="file" accept="video/mp4" onChange={handleFile}/>
      {scan && <pre>{JSON.stringify(scan,null,2)}</pre>}
    </div>
  );
}
