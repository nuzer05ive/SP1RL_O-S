import { DTH } from './SpiralAddress';

export interface Node {
  id: string;
  radius: number;
  theta: number;
  x?: number; y?: number; z?: number;
}

export function step(nodes:Node[], _edges:any[], fireTick:number){
  const angle = fireTick * DTH;
  nodes.forEach(n=>{
    n.theta += DTH;
    const t = n.theta + angle;
    n.x = n.radius * Math.cos(t);
    n.y = n.radius * Math.sin(t);
    n.z = 0;
  });
  return nodes;
}
