import sys
from pathlib import Path

from jinja2 import Environment


def main():
    env = Environment()
    templates_dir = Path("templates")
    for tpl in templates_dir.glob("*.txt"):
        try:
            env.parse(tpl.read_text())
        except Exception as e:
            print(f"Template error in {tpl}: {e}")
            sys.exit(1)


if __name__ == "__main__":
    main()
