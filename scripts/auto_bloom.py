import os

import openai
import requests  # type: ignore

CANON_PROMPTS = [
    (
        0,
        "Origin Burst",
        "bauhaus sunburst, 12 thin white rays + 1 bold gold outburst, phi geometry, elegant",
    ),
    (
        13,
        "Anubis Crescent",
        "stylized anubis, golden crescent, phi spiral motifs, mythic, bauhaus",
    ),
    (
        21,
        "FlameShell",
        "bauhaus flame, nested spiral shells, gold and blue, phi rectangles, VR",
    ),
]

BANTER = [
    "MONDAY: O3, is that another phi burst or just a timeline BLoooM?",
    "O3: Confirmed, Monday! Golden ratio rolls again.",
    "N’1K: This node’s for Wanda—blooming with every story.",
]


def generate_image(prompt, outname, api_key):
    openai.api_key = api_key
    url = openai.Image.create(prompt=prompt, n=1, size="512x512")["data"][0]["url"]
    img = requests.get(url).content
    os.makedirs("bloom_images", exist_ok=True)
    with open(f"bloom_images/{outname}.png", "wb") as f:
        f.write(img)


for i, (node, canon, prompt) in enumerate(CANON_PROMPTS):
    generate_image(
        prompt,
        f"node_{node:02d}_{canon.replace(' ','_')}",
        os.environ["OPENAI_API_KEY"],
    )
    with open("bloom_summary.md", "a") as f:
        f.write(f"Node {node}: {canon}\nPrompt: {prompt}\nBanter: {BANTER[i%3]}\n\n")
