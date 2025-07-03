export default () =>
  new Response(JSON.stringify({ ok: true, phi: 1.618 }), {
    headers: { 'Content-Type': 'application/json' }
  });
