export async function apiUpload(file:File){
  const fd = new FormData(); fd.append("file", file);
  const res = await fetch("/api/upload", { method:"POST", body: fd });
  if(!res.ok) throw new Error("upload failed");
  return await res.json();
}
