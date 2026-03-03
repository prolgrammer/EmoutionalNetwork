import unittest
from unittest.mock import MagicMock, patch
import cv2
from src.camera import CameraCapture

class TestCamera(unittest.TestCase):
    @patch('cv2.VideoCapture')
    def test_camera_open_success(self, mock_video):
        mock_cap = MagicMock()
        mock_cap.isOpened.return_value = True
        mock_video.return_value = mock_cap
        cam = CameraCapture(0)
        self.assertTrue(cam.is_opened())

    @patch('cv2.VideoCapture')
    def test_camera_open_fail(self, mock_video):
        mock_cap = MagicMock()
        mock_cap.isOpened.return_value = False
        mock_video.return_value = mock_cap
        with self.assertRaises(RuntimeError):
            CameraCapture(0)

if __name__ == '__main__':
    unittest.main()