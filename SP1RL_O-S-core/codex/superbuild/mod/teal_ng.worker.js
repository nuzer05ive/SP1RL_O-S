// Web Worker wrapper for TEAL.Ng planner
self.onmessage = async (e) => {
  const data = e.data || {};
  if (data.cmd === 'plan') {
    try {
      const mod = await import('./teal_ng.v1.js');
      const suggestion = await mod.planNext(data.state, data.registry, data.cfg);
      self.postMessage({ ok: true, suggestion });
    } catch (err) {
      self.postMessage({ ok: false, error: err.message });
    }
  }
};
