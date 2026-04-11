# Serene.AI — Version 1 Prototype

An AI-Powered Mental Health Companion built with React.js and FastAPI.

## Project Structure

```
serene-ai/
├── frontend/           # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
└── backend/            # FastAPI application
    ├── main.py
    ├── routes/
    ├── models/
    ├── services/
    └── requirements.txt
```

## Setup Instructions

### Backend (FastAPI)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. Access Swagger docs at: http://localhost:8000/docs

### Frontend (React)

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the app at: http://localhost:3000

## Demo Accounts

- Email: `demo@serene.ai` | Password: `demo123`
- Email: `test@serene.ai` | Password: `test123`

## Created by Group 8
Academic Project | Built with React & FastAPI
