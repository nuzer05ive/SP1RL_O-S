addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(req) {
  const url = new URL(req.url)
  const userPW = parseFloat(req.headers.get('X-PW') || '0')
  if (userPW <= 0) {
    return new Response('Insufficient PW', { status: 402 })
  }
  const useVercel = Math.random() < 0.5
  const target = useVercel ? 'https://vc.example.com' : 'https://nl.example.com'
  return fetch(target + url.pathname)
}
