// SP1RL · prime_address.v1.js  (ESM; no deps)
export const VERSION = 0x02;
export const CLASS = { TP:1, MP:2, PP:3 };
export const CLASS_NAME = { 1:'TP', 2:'MP', 3:'PP' };
export const WITNESS_NAMES = ['Lfix','Dfix','Void','Flux','Hinge'];
export const formatWitness = (w)=> WITNESS_NAMES[(w|0)-1] || 'Unknown';
const PHI = (1+Math.sqrt(5))/2, TAU = Math.PI*2, GOLDEN_ANGLE = TAU*(1-1/PHI);
const K_STAR = 0.000437;
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
/* base58 */
const B58='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const B58_MAP=Object.fromEntries([...B58].map((c,i)=>[c,i]));
export function b58encode(bytes){ if(!bytes.length) return ''; let x=[...bytes],zeros=0; while(zeros<x.length&&x[zeros]===0) zeros++; let digits=[0];
  for(let i=zeros;i<x.length;i++){ let carry=x[i]; for(let j=0;j<digits.length;j++){ carry+=digits[j]<<8; digits[j]=carry%58; carry=(carry/58)|0; } while(carry){ digits.push(carry%58); carry=(carry/58)|0; } }
  return '1'.repeat(zeros)+digits.reverse().map(d=>B58[d]).join(''); }
export function b58decode(str){ let zeros=0; while(zeros<str.length&&str[zeros]==='1') zeros++; let bytes=[0];
  for(let i=zeros;i<str.length;i++){ const v=B58_MAP[str[i]]; if(v===undefined) throw new Error('bad base58'); let carry=v;
    for(let j=0;j<bytes.length;j++){ carry+=bytes[j]*58; bytes[j]=carry&255; carry>>=8; } while(carry){ bytes.push(carry&255); carry>>=8; } }
  return new Uint8Array([...Array(zeros)].map(_=>0).concat(bytes.reverse())); }
export const b64url = {
  enc:(u8)=> btoa(String.fromCharCode(...u8)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),
  dec:(s)=> new Uint8Array(atob(s.replace(/-/g,'+').replace(/_/g,'/').padEnd(s.length+(4-s.length%4)%4,'=')).split('').map(c=>c.charCodeAt(0)))
};
/* CRC16-CCITT */
export function crc16ccitt(u8){ let crc=0xFFFF; for(let b of u8){ crc^=(b<<8); for(let i=0;i<8;i++) crc=(crc&0x8000)?((crc<<1)^0x1021)&0xFFFF:(crc<<1)&0xFFFF; } return crc&0xFFFF; }
/* Human form */
const RX=/^PP:(TP\((\d+)\)|MP\((\d+)\)|PP\((\d+),(\d+)\))@φ43:(\d+):(\d+)~W:(L|R)~K:(\d+)~N:(\d+)~E:(\d+|->)~WIT:(\d+)$/;
export function toHuman(o){ const body=o.class==='PP'?`PP(${o.p},${o.q||0})`:`${o.class}(${o.p})`; return `PP:${body}@φ43:${o.row}:${o.col}~W:${o.wing}~K:${o.k}~N:${o.petal}~E:${o.epoch||'->'}~WIT:${o.witness||o.witnessIndex||5}`; }
export function fromHuman(s){ const m=RX.exec(s); if(!m) throw new Error('bad human address');
  const [,clsRaw,tp,mp,p1,p2,row,col,wing,k,petal,epoch,wit]=m; let cls,p,q=0;
  if(tp){cls='TP';p=+tp;} else if(mp){cls='MP';p=+mp;} else {cls='PP';p=+p1;q=+p2;}
  return {class:cls,p,q,row:+row,col:+col,wing,k:+k,petal:+petal,epoch:(epoch==='->'?0:+epoch),witness:+wit}; }
/* Binary V2 (backward compatible decode for V1) */
export function encodeBytes(o){ const buf=new Uint8Array(1+1+4+4+1+1+1+2+4+4+1+2); let i=0; buf[i++]=0x02; buf[i++]=CLASS[o.class];
  const dv=new DataView(buf.buffer); dv.setUint32(i,o.p>>>0,true); i+=4; dv.setUint32(i,(o.q||0)>>>0,true); i+=4;
  buf[i++]=o.row|0; buf[i++]=o.col|0; buf[i++]=(o.wing==='R')?1:0; dv.setUint16(i,o.k|0,true); i+=2; dv.setUint32(i,o.petal>>>0,true); i+=4;
  dv.setUint32(i,(o.epoch||0)>>>0,true); i+=4; buf[i++]=(o.witness||o.witnessIndex||0); const crc=crc16ccitt(buf.slice(0,i)); dv.setUint16(i,crc,true); return buf; }
export function decodeBytes(u8){ const dv=new DataView(u8.buffer,u8.byteOffset,u8.byteLength); let i=0; const ver=u8[i++];
  const cls=CLASS_NAME[u8[i++]]; if(!cls) throw new Error('bad class'); const p=dv.getUint32(i,true); i+=4; const q=dv.getUint32(i,true); i+=4;
  const row=u8[i++],col=u8[i++],wing=(u8[i++]?'R':'L'); const k=dv.getUint16(i,true); i+=2; const petal=dv.getUint32(i,true); i+=4; const epoch=dv.getUint32(i,true); i+=4;
  let witness=5; if(ver>=0x02){ witness=u8[i++]; }
  const crcR=dv.getUint16(i,true), crcC=crc16ccitt(u8.slice(0,u8.length-2)); return {obj:{class:cls,p,q,row,col,wing,k,petal,epoch,witness}, validCRC:(crcR===crcC)}; }
export function encode(o){ if(!(o.class in {TP:1,MP:1,PP:1})) throw new Error('class TP|MP|PP'); if(o.row<1||o.row>43||o.col<1||o.col>7) throw new Error('φ43 out of range');
  const bytes=encodeBytes(o); return { human:toHuman(o), b58:b58encode(bytes), b64url:b64url.enc(bytes), bytes }; }
export function decode(x){ if(typeof x==='string' && x.startsWith('PP:')) return {obj:fromHuman(x),validCRC:true,source:'human'};
  if(typeof x==='string' && /^[1-9A-HJ-NP-Za-km-z]+$/.test(x)) return {...decodeBytes(b58decode(x)),source:'b58'};
  if(typeof x==='string') return {...decodeBytes(b64url.dec(x)),source:'b64url'};
  if(x instanceof Uint8Array) return decodeBytes(x); throw new Error('unsupported input'); }
/* MAD lattice quantization */
const median=a=>{const b=[...a].sort((x,y)=>x-y),n=b.length; return n%2?b[(n-1)>>1]:0.5*(b[n/2-1]+b[n/2]);};
const mad=a=>{const m=median(a),d=a.map(x=>Math.abs(x-m)); return median(d)||1e-9;}
export function quantizeToPhi43(d2,d3){ const m2=median(d2), s2=mad(d2), z2=(d2.at(-1)-m2)/(s2||1e-9);
  const m3=median(d3), s3=mad(d3), z3=(d3.at(-1)-m3)/(s3||1e-9); const nz=x=>clamp((x+3)/6,0,1);
  const row=1+Math.floor(nz(z2)*43-1e-9), col=1+Math.floor(nz(z3)*7-1e-9); return {row,col,z2,z3}; }
export function chooseWing(votes){ const skew=typeof votes==='number'?votes:((votes?.pos||0)-(votes?.neg||0)); return skew>0?'R':'L'; }
export function addressToView(addr){ const cell=(addr.row-1)*7+(addr.col-1), base=(cell*GOLDEN_ANGLE)%TAU;
  const wingFlip=(addr.wing==='R')?+1:-1, drift=(addr.petal%89)*(K_STAR*wingFlip), angle=(base+drift+TAU)%TAU;
  const rMin=0.32, rMax=1.0, radius=rMin+(rMax-rMin)*Math.exp(-addr.k/PHI);
  const color=addr.wing==='R'?'#ffcc66':'#10c6b2'; const badge=addr.epoch?{type:'prime',label:String(addr.epoch),hue:(addr.epoch%43)/43}:null;
  return {angle,radius,color,badge}; }
export function renderShardCard(target, addr, opts={}){ const {angle,radius,color,badge}=addressToView(addr); const size=opts.size||200;
  const cx=size/2,cy=size/2,R=(size/2)*radius, x=cx+Math.cos(angle)*R, y=cy+Math.sin(angle)*R;
  target.innerHTML=`<div class="shard card" style="background:#0a0f15;border:1px solid #1b2736;border-radius:12px;padding:8px;color:#eaf2ff;font:12px system-ui;display:grid;gap:6px">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs><radialGradient id="g${Math.random().toString(36).slice(2)}"><stop offset="0%" stop-color="${color}" stop-opacity="0.22"/><stop offset="100%" stop-color="${color}" stop-opacity="0.05"/></radialGradient></defs>
      <circle cx="${cx}" cy="${cy}" r="${size/2-6}" fill="url(#g)" stroke="#1b2736"/><line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${color}" stroke-width="2"/>
      <circle cx="${x}" cy="${y}" r="5" fill="${color}"/></svg>
    <div class="meta" style="display:grid;gap:4px">
      <div><b>Address</b> · ${toHuman(addr)}</div>
      <div style="opacity:.8">Class <b>${addr.class}</b> • φ43 <b>${addr.row}:${addr.col}</b> • Wing <b>${addr.wing}</b> • k <b>${addr.k}</b> • Petal <b>${addr.petal}</b>${badge?` • Epoch <b>${badge.label}</b>`:''}</div>
    </div></div>`; }
