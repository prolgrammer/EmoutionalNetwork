import tkinter as tk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import threading

class EmotionGUI:
    def __init__(self):
        self.stop_flag = False
        self.root = tk.Tk()
        self.root.title("Emotion Control")
        self.root.geometry("200x100")
        self.stop_button = tk.Button(self.root, text="Back", command=self.stop)
        self.stop_button.pack(pady=20)
        self.update_gui()

    def stop(self):
        self.stop_flag = True

    def should_stop(self):
        return self.stop_flag

    def update_gui(self):
        self.root.update()

    def show_chart(self, emotions):
        """Display a pie chart of average emotions."""
        if not emotions:
            return
        fig, ax = plt.subplots(figsize=(5,5))
        labels = list(emotions.keys())
        sizes = list(emotions.values())
        ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
        ax.axis('equal')
        # Create a new window for the chart
        chart_window = tk.Toplevel(self.root)
        chart_window.title("Emotion Summary")
        canvas = FigureCanvasTkAgg(fig, master=chart_window)
        canvas.draw()
        canvas.get_tk_widget().pack()
        # Add save button
        save_btn = tk.Button(chart_window, text="Save PNG", command=lambda: fig.savefig("emotion_chart.png"))
        save_btn.pack()
        plt.close(fig)

    def show_message(self, msg):
        msg_window = tk.Toplevel(self.root)
        tk.Label(msg_window, text=msg).pack(pady=20)