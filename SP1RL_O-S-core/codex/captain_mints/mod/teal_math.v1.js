function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s[mid];
}

function mad(arr) {
  if (!arr.length) return 1e-9;
  const m = median(arr);
  const dev = arr.map(v => Math.abs(v - m));
  return median(dev) || 1e-9;
}

export function essenceScore(kappa, streams) {
  const base = Math.exp(-Math.abs(kappa - 0.000437) * 1000);
  const bonus = tealLock(streams) ? 0.1 : 0;
  return Math.min(1, base + bonus);
}

export function updateStreams(streams, score) {
  streams.d = streams.d || [];
  streams.d1 = streams.d1 || [];
  streams.d2 = streams.d2 || [];
  streams.d3 = streams.d3 || [];
  streams.d.push(score);
  const n = streams.d.length;
  streams.d1.push(n > 1 ? score - streams.d[n - 2] : 0);
  streams.d2.push(n > 1 ? streams.d1[n - 1] - streams.d1[n - 2] : 0);
  streams.d3.push(n > 1 ? streams.d2[n - 1] - streams.d2[n - 2] : 0);
}

export function tealLock(streams) {
  const z = (arr) => {
    const m = median(arr);
    return arr.length ? Math.abs(arr[arr.length - 1] - m) / mad(arr) : 0;
  };
  const z2 = z(streams.d2 || []);
  const z3 = z(streams.d3 || []);
  return z2 > 2 && z3 > 2;
}
