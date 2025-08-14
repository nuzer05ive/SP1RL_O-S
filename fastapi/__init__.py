class FastAPI:
    def __init__(self, *args, **kwargs):
        pass
    def post(self, path):
        def decorator(fn):
            return fn
        return decorator

def Body(*args, **kwargs):
    return None
