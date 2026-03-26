from contextlib import asynccontextmanager
from database import create_db_and_tables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables() # Create database tables before app startup.
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(auth.router)
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