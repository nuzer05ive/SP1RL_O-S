import fs from "node:fs";
import { writeAutoReceipts, aggregateLedger } from "../src/ledger";

describe("ledger", () => {
  it("appends and aggregates receipts", () => {
    fs.rmSync("out/ledger", { recursive:true, force:true });
    writeAutoReceipts("ep1", [{ts:1, entry:"E1", witness:".Q"}]);
    writeAutoReceipts("ep2", [{ts:2, entry:"E2", witness:".Q"}]);
    const agg = aggregateLedger();
    expect(agg.length).toBe(2);
    expect(agg[0].entry).toBe("E1");
  });
});

