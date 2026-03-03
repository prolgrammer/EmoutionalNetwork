import unittest
import numpy as np
import cv2
from src.detection import detect_faces, draw_annotations

class TestDetection(unittest.TestCase):
    def test_detect_faces_empty(self):
        # Create blank image
        frame = np.zeros((480,640,3), dtype=np.uint8)
        faces = detect_faces(frame)
        self.assertEqual(len(faces), 0)

    def test_draw_annotations(self):
        frame = np.zeros((480,640,3), dtype=np.uint8)
        face_locs = [(100,200,200,100)]
        emotions = {'angry': 0.5, 'happy': 0.5}
        new_frame = draw_annotations(frame, face_locs, emotions)
        self.assertIsNotNone(new_frame)

if __name__ == '__main__':
    unittest.main()