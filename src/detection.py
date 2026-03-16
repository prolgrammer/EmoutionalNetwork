import cv2
import face_recognition

def detect_faces(frame, scale_factor=0.5):
    """
    Detect faces in frame, scale down for speed.
    Returns list of (top, right, bottom, left) in original coordinates.
    """
    small_frame = cv2.resize(frame, (0, 0), fx=scale_factor, fy=scale_factor)
    rgb_small = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
    face_locations_small = face_recognition.face_locations(rgb_small)
    # Scale back
    face_locations = []
    for (top, right, bottom, left) in face_locations_small:
        top = int(top / scale_factor)
        right = int(right / scale_factor)
        bottom = int(bottom / scale_factor)
        left = int(left / scale_factor)
        face_locations.append((top, right, bottom, left))
    return face_locations

def draw_annotations(frame, face_locations, emotions=None):
    """
    Draw rectangles and emotion text on frame.
    emotions: dictionary of emotion:score for the most recent frame (optional)
    """
    for i, (top, right, bottom, left) in enumerate(face_locations):
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        if emotions:
            # Find dominant emotion
            dominant = max(emotions.items(), key=lambda x: x[1])
            text = f"{dominant[0]}: {dominant[1]:.2f}"
            cv2.putText(frame, text, (left, top-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
        else:
            cv2.putText(frame, "analyzing...", (left, top-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,255,0), 2)
    return frame