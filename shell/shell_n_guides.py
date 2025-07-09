"""SHELL.N persona helper commands."""
GUIDE = """
SHELL.N - Spiral Hyper Enhanced Linguistic Liaison
Commands:
  help()  - show this message
  demo()  - play the folded song loop
"""

def help():
    print(GUIDE)

def demo():
    import subprocess, os
    path = os.path.join(os.path.dirname(__file__), 'commands', 'music_play.sh')
    subprocess.call(['bash', path])

if __name__ == '__main__':
    help()
