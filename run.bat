@echo off
echo ==============================================
echo        Starting Serene.AI Environment         
echo ==============================================

echo [1/2] Starting FastAPI Backend on port 8000...
cd backend
start cmd /k "title Serene.AI Backend && python -m uvicorn main:app --reload --port 8000"

echo [2/2] Starting React Frontend on port 3000...
cd ../frontend
start cmd /k "title Serene.AI Frontend && npm start"

echo.
echo Serene.AI is launching! 
echo Make sure you have added your Gemini API key to backend/.env
echo.
pause
