import React, { useState } from 'react';

function AssetGallery({ assets }) {
  if (!assets) return null;
  return (
    <div className="asset-gallery">
      {Object.entries(assets).map(([type, files]) => (
        <div key={type} className="asset-group">
          <h3>{type}</h3>
          <ul>
            {files.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function MondayAssetTool() {
  const [assets, setAssets] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    await fetch('/api/monday/generate', { method: 'POST' });
    const data = await fetch('/api/monday/assets_map').then((r) => r.json());
    setAssets(data);
    setLoading(false);
  }

  return (
    <div className="monday-tool">
      <h1>MONDAY Asset Generator</h1>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Assets'}
      </button>
      <AssetGallery assets={assets} />
    </div>
  );
}
