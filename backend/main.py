from contextlib import asynccontextmanager
from database import create_db_and_tables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, answers, games, rounds, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables() # Create database tables before app startup.
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(games.router)
app.include_router(rounds.router)
app.include_router(answers.router)
app.include_router(users.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:3000',
        'https://localhost:3000'
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
async def root():
    return {'message': 'Welcome!'}