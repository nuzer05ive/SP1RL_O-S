import {
  nthPrime, partialZeta3ByIndex, primesUpTo,
  chiQ, shadowToothSign, P_of,
  witnessLiftSO4, portalFunctional, Consts
} from "../portal";

// helpers
const approx = (a: number, b: number, tol=1e-9) => Math.abs(a - b) <= tol;
function matT(A: number[]): number[] { const T=new Array(16); for(let r=0;r<4;r++)for(let c=0;c<4;c++)T[4*r+c]=A[4*c+r]; return T; }
function matMul(A: number[], B: number[]): number[]{const C=new Array(16).fill(0);for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(let k=0;k<4;k++)C[4*r+c]+=A[4*r+k]*B[4*k+c];return C;}
function isIdentity(A: number[], tol=1e-8): boolean {for(let r=0;r<4;r++)for(let c=0;c<4;c++){const want=(r===c)?1:0;if(Math.abs(A[4*r+c]-want)>tol)return false;}return true;}

// tests
describe("prime utilities", () => {
  it("nthPrime matches first 16 primes", () => {
    const table=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53];
    for(let i=1;i<=table.length;i++) expect(nthPrime(i)).toBe(table[i-1]);
  });
  it("primesUpTo returns primes up to limit", () => {
    expect(primesUpTo(30)).toEqual([2,3,5,7,11,13,17,19,23,29]);
  });
});

describe("partial ζ(3) product", () => {
  it("is monotone increasing", () => {
    const vals=[5,10,20,30].map(n=>partialZeta3ByIndex(n));
    for(let i=1;i<vals.length;i++) expect(vals[i]).toBeGreaterThan(vals[i-1]);
  });
  it("approaches Apéry’s constant loosely", () => {
    const z50=partialZeta3ByIndex(50);
    expect(Math.abs(z50-Consts.zeta3Approx)).toBeLessThan(0.06);
  });
});

describe("chirality & cadence", () => {
  it("chiQ alternates ±1", () => {
    expect(chiQ(1)).toBe(-1); expect(chiQ(2)).toBe(1);
  });
  it("shadowToothSign 0.55×3 then 0.45×3", () => {
    const blocks=[0.55,0.55,0.55,0.45,0.45,0.45]; const T=blocks.reduce((a,b)=>a+b,0);
    let t=0; for(let i=0;i<blocks.length;i++){const mid=t+blocks[i]/2;const s=shadowToothSign(mid); if(i<3) expect(s).toBe(1); else expect(s).toBe(-1); t+=blocks[i];}
    expect(shadowToothSign(T+0.1)).toBe(1);
  });
});

describe("portal constant P(n)", () => {
  it("finite values & chiQ flip", () => {
    const p5=P_of(5), p6=P_of(6), p50=P_of(50);
    expect(Number.isFinite(p5)).toBe(true); expect(Number.isFinite(p50)).toBe(true);
    expect(p5).not.toBe(p6);
  });
});

describe("witness lift SO(4)", () => {
  it("R4 orthogonal: RᵀR≈I", () => {
    const {R4}=witnessLiftSO4([0,1,0],Math.PI/3,1); const RTR=matMul(matT(R4),R4);
    expect(isIdentity(RTR,1e-8)).toBe(true);
  });
  it("chirality flips skew", () => {
    const {R4:A}=witnessLiftSO4([0,1,0],1.234,1);
    const {R4:B}=witnessLiftSO4([0,1,0],1.234,-1);
    let diff=0; for(let i=0;i<16;i++) diff+=Math.abs(A[i]-B[i]); expect(diff).toBeGreaterThan(1e-6);
  });
});

describe("portal functional driver", () => {
  it("finite fields & cadence flips", () => {
    const S0=portalFunctional(7,0.2,{thetaPrime:0.25,usePortalInZoom:true});
    for(const k of ["s","alpha","h","Pn","zetaTerm"] as const)
      expect(Number.isFinite((S0 as any)[k])).toBe(true);
    const d0=portalFunctional(7,0.2).d, d1=portalFunctional(7,1.8).d, d2=portalFunctional(7,3.6).d;
    expect(d0).toBe(1); expect(d1).toBe(-1); expect(d2).toBe(1);
  });
});

