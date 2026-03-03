from fer import FER
import cv2

detector = FER()

def analyze_emotions(face_image, padding=20):
    """
    Detect emotions on a face image (numpy array BGR).
    Returns dictionary of emotions or None.
    """
    # Add padding to face region
    h, w = face_image.shape[:2]
    top = max(0, padding)
    bottom = min(h, h + padding)
    left = max(0, padding)
    right = min(w, w + padding)
    padded_face = face_image[top:bottom, left:right]
    # Convert to RGB
    rgb_face = cv2.cvtColor(padded_face, cv2.COLOR_BGR2RGB)
    result = detector.detect_emotions(rgb_face)
    if result:
        return result[0]['emotions']
    return None