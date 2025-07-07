import json

from spiral_time.constants import PHI
from spiral_time.solver import solve_spiral_time


def main():
    data = []
    for S in range(221):
        res = solve_spiral_time(S)
        data.append({"episode": S + 1, "phi_power": round(S / PHI, 6), **res})
    with open("data/onboarding_221.json", "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    main()
