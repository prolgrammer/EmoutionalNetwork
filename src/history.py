from collections import deque

class EmotionHistory:
    def __init__(self, maxlen=50):
        self.history = deque(maxlen=maxlen)

    def add(self, emotions_dict):
        """Add a dictionary of emotions for one frame."""
        self.history.append(emotions_dict)

    def get_average(self):
        """Return average emotions across entire history."""
        if not self.history:
            return {}
        avg = {}
        for key in self.history[0].keys():
            avg[key] = sum(d[key] for d in self.history) / len(self.history)
        return avg

    def get_last(self):
        """Return most recent emotions."""
        return self.history[-1] if self.history else None

    def __len__(self):
        return len(self.history)