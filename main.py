import cv2
from src.camera import CameraCapture
from src.detection import detect_faces, draw_annotations
from src.emotion_analyzer import analyze_emotions

def main():
    cam = CameraCapture(0)
    while True:
        frame = cam.get_frame()
        if frame is None:
            break
        faces = detect_faces(frame)
        # Для каждого лица получим эмоции
        emotions_list = []
        for (t,r,b,l) in faces:
            face_img = frame[t:b, l:r]
            emo = analyze_emotions(face_img)
            if emo:
                emotions_list.append(emo)
        # Усредняем (просто для примера берём первое)
        avg_emo = emotions_list[0] if emotions_list else None
        frame = draw_annotations(frame, faces, avg_emo)
        cv2.imshow('Emotion Detection', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cam.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()