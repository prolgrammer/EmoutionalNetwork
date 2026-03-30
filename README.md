# Emotion Analysis Application

<div align="center">
Приложение для анализа эмоций человека в реальном времени
</div>

---

## 🚀 Установка и запуск

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

### 📸 POST /analyze

Анализирует изображение и возвращает эмоции.

#### Request (multipart/form-data)

| Параметр    | Тип    | Обязательный | Описание |
|------------|--------|-------------|----------|
| file       | file   | ✅          | Изображение |
| session_id | string | ❌          | ID сессии |
| accumulate | bool   | ❌          | Накопление |

#### Response

```json
{
  "dominant": "happiness",
  "emotions": {
    "neutral": 0.02,
    "happiness": 0.77,
    "sadness": 0.01,
    "anger": 0.00,
    "surprise": 0.17,
    "fear": 0.02,
    "disgust": 0.01
  },
  "faces_count": 1,
  "confidence": 0.77
}
```

---

### 🧹 POST /clear_session/{session_id}

Очищает историю сессии.

```json
{
  "status": "cleared"
}
```

---

## 📁 Структура проекта

```text
emotion-analysis/
├── backend/
│   ├── main.py                # FastAPI приложение
│   └── requirements.txt       # Python-зависимости
├── frontend/
│   ├── src/
│   │   ├── api/               # (удалён моковый API)
│   │   ├── components/        # React-компоненты
│   │   │   ├── EmotionDisplay.tsx
│   │   │   ├── EmotionInsight.tsx
│   │   │   ├── StatisticsPanel.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── VideoSourceSelector.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/             # кастомные хуки
│   │   │   ├── useVideoStream.ts
│   │   │   └── useEmotionAnalysis.ts
│   │   ├── types/             # TypeScript-типы
│   │   │   └── emotion.ts
│   │   ├── App.tsx            # корневой компонент
│   │   └── main.tsx           # точка входа
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---