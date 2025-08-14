import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('app')
    parser.add_argument('--reload', action='store_true')
    args = parser.parse_args()
    print(f"[uvicorn stub] would serve {args.app} reload={args.reload}")

if __name__ == '__main__':
    main()
