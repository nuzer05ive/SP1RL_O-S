import { receipt } from "../../packages/core/src/mathReceipts";
import popup from "./popup";
import * as vr from "./vr";

const loadBtn = document.getElementById("load")!;
const popupBtn = document.getElementById("popup")!;
const vrBtn = document.getElementById("vr")!;
const receiptEl = document.getElementById("receipt")!;

let current: any = null;

loadBtn.onclick = async () => {
  const name = prompt("Panel name?", "panel_01_yeyes_gate.json") || "";
  const res = await fetch(`/panel/${name}`);
  current = await res.json();
  receiptEl.textContent = receipt(current.world, current.thetaPrimeKappa, current.phiTiltIndex);
};

popupBtn.onclick = () => popup.applySeamLift();
vrBtn.onclick = () => vr.enter();
