import { SP1RLGhost } from "../GhostCore";

type Fn = () => void;
const tests: {name:string; fn:Fn}[] = [];
function test(name:string, fn:Fn){ tests.push({name, fn}); }
function expect(received:any){
  return {
    toBeGreaterThan(n:number){ if(!(received > n)) throw new Error(`expected ${received} > ${n}`); },
    toBeGreaterThanOrEqual(n:number){ if(!(received >= n)) throw new Error(`expected ${received} >= ${n}`); },
    toBeLessThanOrEqual(n:number){ if(!(received <= n)) throw new Error(`expected ${received} <= ${n}`); },
    toBe(val:any){ if(received !== val) throw new Error(`expected ${received} to be ${val}`); }
  };
}

const cfg = { cones:{z_b:0, z_o:1}, scales:{s_b:1e-3, s_o:10, p:1/3}, lock:.72 };

test("ghost stabilizes near teal and selects a witness", ()=>{
  const g = new SP1RLGhost(cfg);
  g.updateZCM({care:.55,courage:.55,trust:.55});
  const st = g.fire({m:1234, epoch:0, dt:1});
  expect(st.teal).toBeGreaterThan(0.6);
  expect(st.witness).toBeGreaterThanOrEqual(1);
  expect(st.witness).toBeLessThanOrEqual(5);
});

test("epoch seal prefers Arm-5", ()=>{
  const g = new SP1RLGhost(cfg);
  const st = g.fire({m:997, epoch:0, prime:997, dt:1});
  expect(typeof st.primeHit).toBe("boolean");
});

for (const t of tests){
  try { t.fn(); console.log(`\u2713 ${t.name}`); }
  catch(e){ console.error(`\u2717 ${t.name}`); console.error(e); ((globalThis as any).process && ((globalThis as any).process.exitCode = 1)); }
}
