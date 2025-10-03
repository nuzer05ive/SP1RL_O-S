'use client';

import React from 'react';
import { decodePMB } from '../lib/pmb/decode';
import type { PMBPayload } from '../../../../packages/core/src/pmbAssign';

export default function PMBScanner({ onLoad }: { onLoad: (payload: PMBPayload) => void }) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera unavailable in this environment. Use the upload field.');
      return () => {};
    }
    let active = true;
    let currentStream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((mediaStream) => {
        if (!active) return;
        currentStream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {
            setError('Unable to start camera preview.');
          });
        }
      })
      .catch(() => {
        setError('Camera permissions denied. Use file upload instead.');
      });
    return () => {
      active = false;
      mediaStreamStop(currentStream);
    };
  }, []);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const payload = await decodePMB(file);
      onLoad(payload);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Unable to decode PMB.');
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
    if (!blob) {
      setError('Failed to capture frame from camera.');
      return;
    }
    try {
      const payload = await decodePMB(blob);
      onLoad(payload);
      setError('');
    } catch (err: any) {
      setError('Frame captured but PMB payload not found. Try uploading the exported PNG.');
    }
  };

  return (
    <section className="scanner">
      <header>
        <h2>Scan PMB</h2>
        <p>Point at a Möbius Rainbow barcode or upload the exported PNG.</p>
      </header>
      <video ref={videoRef} playsInline muted className="preview" />
      <div className="actions">
        <button type="button" className="btn" onClick={handleCapture}>
          Capture Frame
        </button>
        <label className="btn file">
          Upload / Camera
          <input type="file" accept="image/*" capture="environment" onChange={handleFile} />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
    </section>
  );
}

function mediaStreamStop(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}
