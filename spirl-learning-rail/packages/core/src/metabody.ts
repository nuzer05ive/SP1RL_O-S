import { Sticker, WitnessMode, MetaBodyJSON } from "./types";

/** Minimal stub class representing a MetaBody. */
export class MetaBody {
  stickers: Sticker[] = [];
  mode: WitnessMode = "journey";
  constructor(public data: MetaBodyJSON) {}
  toggleWitness(): void {
    this.mode = this.mode === "journey" ? "ribbon" : "journey";
  }
  addSticker(s: Sticker) {
    this.stickers.push(s);
  }
}
