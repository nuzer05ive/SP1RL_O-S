export async function api(path: string, opts?: RequestInit) {
  const res = await fetch(`/api/${path}`, opts);
  return res.json();
}
