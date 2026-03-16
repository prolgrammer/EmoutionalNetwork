import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk

from App.EmFrCam.CamLauncher import start_emotion_detection
from App.EmFrWindow.WindowLauncher import start_emotion_detection_from_screen  # Импорт функции для записи с экрана

diagram_widget = None
# Функция для возврата в главное меню
def main_menu():
    # Очищаем окно
    global diagram_widget

    # Очищаем окно
    for widget in window.winfo_children():
        widget.destroy()

    # Загружаем изображение
    image = Image.open("../Photos/e66fc2d6-dc34-49b4-a16b-700611889284.webp")
    image = image.resize((800, 600), Image.Resampling.LANCZOS)
    photo = ImageTk.PhotoImage(image)

    # Создаем метку для изображения
    image_label = tk.Label(window, image=photo)
    image_label.photo = photo  # Сохраняем ссылку, чтобы избежать удаления
    image_label.pack(pady=20)

    # Если есть диаграмма, добавляем её
    if diagram_widget:
        diagram_widget.pack(pady=20)

    # Создаем фрейм для кнопок
    button_frame = tk.Frame(window)
    button_frame.pack(pady=20)

    # Кнопки
    button1 = tk.Button(button_frame, text="Анализ эмоций с камеры", command=lambda: start_emotion_detection(window, main_menu), width=20, height=2)
    button1.grid(row=0, column=0, padx=10)

    button2 = tk.Button(button_frame, text="Анализ эмоций с экрана",
                        command=start_emotion_detection_from_screen, width=30, height=2)
    button2.grid(row=0, column=1, padx=10)

# Создаем основное окно
window = tk.Tk()
window.title("Interface with Image and Buttons")
window.geometry("800x600")

# Запускаем главное меню при старте
main_menu()

# Запуск основного цикла
window.mainloop()
