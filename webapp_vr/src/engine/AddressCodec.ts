import { Params, encode, decode } from './SpiralAddress';

export interface IdeaMeta {
  params: Params;
  text: string;
}

export const toAddress = (meta:IdeaMeta)=> encode(meta.params);
export const fromAddress = (addr:string, text:string):IdeaMeta => ({ params: decode(addr), text });
