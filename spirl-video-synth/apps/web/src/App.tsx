import React, { useState } from 'react';

export default function App() {
  const [json, setJson] = useState<any>(null);
  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const j = await res.json();
    setJson(j);
    localStorage.setItem('scan.json', JSON.stringify(j));
  }
  return (
    <div>
      <h1>SP1RL Upload</h1>
      <input type="file" accept="video/mp4" onChange={onUpload} />
      {json && <pre>{JSON.stringify(json, null, 2)}</pre>}
      {json && <a href="/apps/viewer/index.html" target="_blank" rel="noreferrer">Open Viewer</a>}
    </div>
  );
}
