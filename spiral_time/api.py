"""Simple Flask API exposing the spiral time solver."""

from flask import Flask, request, jsonify

from datetime import datetime
from .solver import solve_spiral_time, get_julian_day

app = Flask(__name__)


@app.route('/solve_time', methods=['POST'])
def solve_time_endpoint():
    data = request.get_json() or {}
    date = data.get('date')
    S = data.get('S')
    if S is None:
        if not date:
            return jsonify({'error': 'date required'}), 400
        S = get_julian_day(date)
    if date is None:
        date = datetime.utcnow().strftime('%Y-%m-%d')
    result = solve_spiral_time(date, int(S))
    return jsonify(result)


if __name__ == '__main__':
    app.run()
