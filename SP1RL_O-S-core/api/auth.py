import logging
import os


def check_env(vars):
    missing = [v for v in vars if not os.getenv(v)]
    if missing:
        logging.error("Missing env vars: %s", ",".join(missing))
        raise SystemExit(503)
