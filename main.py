import threading
import cv2
from src.camera import CameraCapture
from src.detection import detect_faces, draw_annotations
from src.emotion_analyzer import analyze_emotions
from src.history import EmotionHistory
from src.gui import EmotionGUI

def main():
    cam = CameraCapture(0)
    history = EmotionHistory(50)
    gui = EmotionGUI()
    running = True

    def analyze_thread():
        nonlocal running
        while running:
            frame = cam.get_frame()
            if frame is None:
                continue
            faces = detect_faces(frame)
            emo_list = []
            for (t,r,b,l) in faces:
                face_img = frame[t:b, l:r]
                emo = analyze_emotions(face_img)
                if emo:
                    emo_list.append(emo)
            if emo_list:
                # average
                avg = {}
                for k in emo_list[0]:
                    avg[k] = sum(d[k] for d in emo_list) / len(emo_list)
                history.add(avg)
            cv2.waitKey(100)  # small delay

    thread = threading.Thread(target=analyze_thread, daemon=True)
    thread.start()

    while running:
        frame = cam.get_frame()
        if frame is None:
            break
        faces = detect_faces(frame)
        last_emo = history.get_last()
        frame = draw_annotations(frame, faces, last_emo)
        cv2.imshow('Emotion Detection', frame)
        if cv2.waitKey(1) & 0xFF == ord('q') or gui.should_stop():
            running = False
            break

    cam.release()
    cv2.destroyAllWindows()
    if len(history) > 0:
        gui.show_chart(history.get_average())
    else:
        print("No emotions recorded")

if __name__ == '__main__':
    main()