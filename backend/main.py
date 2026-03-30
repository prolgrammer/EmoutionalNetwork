import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fer.fer import FER
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # или ["*"] для теста
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

emotion_detector = FER()
CONFIDENCE_THRESHOLD = 0.05   # можно увеличить, если нужно отсеивать низкую уверенность

# Маппинг названий эмоций FER -> единый формат
EMOTION_MAP = {
    'angry': 'anger',
    'disgust': 'disgust',
    'fear': 'fear',
    'happy': 'happiness',
    'sad': 'sadness',
    'surprise': 'surprise',
    'neutral': 'neutral'
}

@app.post("/analyze")
async def analyze_emotion(
        file: UploadFile = File(...),
        session_id: str = None,
        accumulate: bool = False
):
    # 1. Проверка типа файла
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")

    # 2. Чтение и декодирование изображения
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(400, "Invalid image")

    # 3. Преобразование BGR -> RGB (FER ожидает RGB)
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # 4. Анализ эмоций
    try:
        results = emotion_detector.detect_emotions(rgb_img)
        logging.info(f"Raw results: {results}")  # ← лог сырых данных
    except Exception as e:
        logging.error(f"Emotion detection error: {e}")
        raise HTTPException(500, "Emotion detection failed")

    if not results:
        return {
            "dominant": "No face detected",
            "emotions": None,
            "faces_count": 0
        }

    # 5. Преобразование ключей эмоций в единый формат
    emotions_list = []
    for res in results:
        raw_emotions = res['emotions']
        mapped = {EMOTION_MAP[k]: v for k, v in raw_emotions.items() if k in EMOTION_MAP}
        emotions_list.append(mapped)

    faces_count = len(emotions_list)

    # 6. Усреднение по всем лицам
    avg = {}
    if emotions_list:
        for emotion in emotions_list[0].keys():
            values = [e[emotion] for e in emotions_list]
            avg[emotion] = np.mean(values)
        logging.info(f"Averaged emotions: {avg}")  # ← лог усреднённых данных
    else:
        avg = {}

    # 7. Определение доминирующей эмоции
    if avg:
        dominant = max(avg, key=avg.get)
        if avg[dominant] < CONFIDENCE_THRESHOLD:
            dominant = "Neutral"
    else:
        dominant = "No emotion detected"

    return {
        "dominant": dominant,
        "emotions": avg,
        "faces_count": faces_count,
        "confidence": avg.get(dominant, 0)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)