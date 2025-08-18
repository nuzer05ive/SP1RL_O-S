let model: any;

async function loadModel(){
  if(!model){
    const use = await import('@tensorflow-models/universal-sentence-encoder');
    model = await use.load();
  }
  return model;
}

export async function embed(text:string):Promise<number[]>{
  const m = await loadModel();
  const v = await m.embed(text);
  const data = await v.data();
  v.dispose();
  return Array.from(data);
}

export function cosine(a:number[], b:number[]){
  let dot=0,na=0,nb=0;
  for(let i=0;i<a.length && i<b.length;i++){
    dot += a[i]*b[i];
    na += a[i]*a[i];
    nb += b[i]*b[i];
  }
  return dot / Math.sqrt(na*nb);
}
