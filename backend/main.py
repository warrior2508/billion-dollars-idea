from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://billion-dollars-idea.vercel.app",  # production frontend
    "http://localhost:5173",  # development frontend
    "https://6c48-51-20-140-171.ngrok-free.app",  # ngrok URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API is running"} 