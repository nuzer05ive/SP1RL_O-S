function setup(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.clientWidth || 200;
  canvas.height = canvas.clientHeight || 200;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return ctx;
}

export function drawSpiral(canvas, items) {
  const ctx = setup(canvas);
  const phi = Math.PI * (3 - Math.sqrt(5));
  items.forEach((item, i) => {
    const r = 4 * Math.sqrt(i + 1);
    const a = (i + 1) * phi;
    const x = canvas.width / 2 + r * Math.cos(a);
    const y = canvas.height / 2 + r * Math.sin(a);
    ctx.beginPath();
    ctx.fillStyle = item.score >= 0.72 ? 'teal' : '#888';
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    if (item.witness) {
      ctx.strokeStyle = 'red';
      ctx.stroke();
    }
    if (item.treasury) {
      ctx.strokeStyle = 'gold';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
}

export function drawHinges(canvas, streams) {
  const ctx = setup(canvas);
  const names = ['d', 'd1', 'd2', 'd3'];
  ctx.fillStyle = 'rgba(0,128,128,0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  names.forEach((n, idx) => {
    const arr = streams[n] || [];
    if (!arr.length) return;
    ctx.beginPath();
    arr.forEach((v, j) => {
      const x = (j / Math.max(arr.length - 1, 1)) * canvas.width;
      const y = idx * 50 + 25 - v * 40;
      if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'teal';
    ctx.stroke();
  });
}
