from dataclasses import dataclass
from datetime import datetime, timezone
from math import floor

PHI = 1.6180339887498948
PRIME_TICKS = 89  # 60s mapped to 89 prime nodes (+ wobble in HUD)

def st_from_dt(dt: datetime) -> str:
    # ST=[loops(leg)min:sec.ms] where leg (/ dive, \ ascend, /\/ bloom)
    loops = floor((dt.timetuple().tm_yday % 26))  # coarse loop index in 26-letter cycle
    m = dt.minute
    s = dt.second
    ms = int(dt.microsecond/10000)
    # leg: counter-clockwise dive during 0-19s, clockwise ascend 20-39s, bloom 40-59s
    leg = "(/)" if s < 20 else "(\\)" if s < 40 else "(/\\/)"
    return f"{loops:02d}{leg}{m:02d}:{s:02d}.{ms:02d}"

@dataclass
class SpiralStamp:
    local_iso: str
    zulu_iso: str
    minute_slot: str      # e.g. (16:34)
    hundred_slot: int     # 0..99
    st: str               # ST=[..]
    place: str            # freeform "known address"/label

def mint(place: str = "Unknown") -> SpiralStamp:
    now = datetime.now().astimezone()
    z = datetime.now(timezone.utc)
    # slot between minute and next minute (0..99) using 89 prime ticks + 11 wobble
    hundred = floor((now.second + now.microsecond/1e6) / 60 * 100)
    return SpiralStamp(
        local_iso=now.isoformat(timespec="seconds"),
        zulu_iso=z.isoformat(timespec="seconds").replace("+00:00","Z"),
        minute_slot=f"({now.hour:02d}:{now.minute:02d})",
        hundred_slot=hundred,
        st=f"[ST-{st_from_dt(now)}]",
        place=place,
    )
