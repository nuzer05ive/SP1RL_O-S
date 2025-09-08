# Chat Braid

Chat turns carry one of five tags:
`[iN]`, `[oN]`, `[oNYiN]`, `[YaNg]`, `[YiN]`. A tag may include a role:
`[iN/host] hello world`. Lines are grouped until `YiN` closes the chunk.

## Example Transcript

```
[iN/host] Start here
[oN/user] Reply one
[oNYiN/host] Small example
[YaNg/user] Aha!
[YiN] Done
```

## Example Chunk JSON

```
{
  "id": "...",
  "participants": ["host", "user"],
  "turns": [
    { "tag": "iN", "role": "host", "surface": "Start here", "full": "Start here" },
    { "tag": "oN", "role": "user", "surface": "Reply one", "full": "Reply one" },
    { "tag": "oNYiN", "role": "host", "surface": "Small example", "full": "Small example" },
    { "tag": "YaNg", "role": "user", "surface": "Aha!", "full": "Aha!" },
    { "tag": "YiN", "role": "", "surface": "Done", "full": "Done" }
  ],
  "closure": true
}
```

## Scoring

* **coherence** – cosine similarity of adjacent 3‑gram vectors.
* **edgeDensity** – observed role transitions vs. possible edges.
* **leastAction** – inverse of turn count.
* **zcm** – blend of the above used for mint gating.

Mint requires both human `.su` and AI `.ai` approval: `zcm ≥ 0.80`.

## Replay as Petal

The score reducer maps chunks for visualization:

* `witnessSector = (Math.floor(Date.now()/137) % 8)`
* `bloomLayer = coherence > 0.75 ? 'outer' : 'inner'`

Minted petals add to the bloom and highlight the witness sector.
