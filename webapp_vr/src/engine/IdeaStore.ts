import localforage from 'localforage';
import { Params } from './SpiralAddress';

export interface Idea extends Params {
  id: string;
  text: string;
}

const store = localforage.createInstance({ name: 'ideas' });

export async function saveIdea(idea:Idea){
  await store.setItem(idea.id, idea);
}

export async function loadIdeas():Promise<Idea[]>{
  const ideas:Idea[] = [];
  await store.iterate((v:Idea)=>{ ideas.push(v); });
  return ideas;
}

export async function exportJSON(){
  const ideas = await loadIdeas();
  return JSON.stringify(ideas);
}

export async function importJSON(json:string){
  const ideas:Idea[] = JSON.parse(json);
  for(const idea of ideas){ await saveIdea(idea); }
}
