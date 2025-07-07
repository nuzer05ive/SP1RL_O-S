"""Simple Flask API exposing the spiral time solver."""

from flask import Flask, request, jsonify

from datetime import datetime
from .solver import solve_spiral_time, get_julian_day, solve_sss
from pathlib import Path

app = Flask(__name__)


@app.route("/solve_time", methods=["POST"])
def solve_time_endpoint():
    data = request.get_json() or {}
    date = data.get("date")
    S = data.get("S")
    if S is None:
        if not date:
            return jsonify({"error": "date required"}), 400
        S = get_julian_day(date)
    result = solve_spiral_time(int(S))
    return jsonify(result)


@app.route("/solve_sss", methods=["POST"])
def solve_sss_endpoint():
    data = request.get_json() or {}
    dt = data.get("datetime")
    if not dt:
        return jsonify({"error": "datetime required"}), 400
    result = solve_sss(dt)
    return jsonify(result)


@app.route("/metal/reserve", methods=["POST"])
def reserve_petal():
    """Create backend sync folder for front-end component."""
    data = request.get_json() or {}
    user = data.get("user", "anon")
    h = data.get("hash", "")
    path = Path(f"backend/sync/{h}")
    path.mkdir(parents=True, exist_ok=True)
    return jsonify({"ok": True, "path": str(path)})


if __name__ == "__main__":
    app.run()
