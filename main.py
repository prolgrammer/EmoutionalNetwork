import cv2
from src.camera import CameraCapture
from src.detection import detect_faces
from src.emotion_analyzer import analyze_emotions

def main():
    cam = CameraCapture(0)
    frame = cam.get_frame()
    if frame is not None:
        faces = detect_faces(frame)
        for (t,r,b,l) in faces:
            face_img = frame[t:b, l:r]
            emotions = analyze_emotions(face_img)
            print(emotions)
    cam.release()

if __name__ == '__main__':
    main()