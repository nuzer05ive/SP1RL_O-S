import json

from spiral_time.solver import solve_spiral_time


def main():
    episodes = []
    for i in range(222):
        res = solve_spiral_time("1970-01-01", i)
        episodes.append(
            {
                "episode_num": i,
                "phi_power": i,
                "node": res["node"],
                "lap": res["lap"],
                "dt": res["t_seconds"],
                "glyph": "",
                "lore": "",
            }
        )
    with open("data/onboarding_221.json", "w") as f:
        json.dump(episodes, f, indent=2)


if __name__ == "__main__":
    main()
