from datetime import datetime
from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class GameBase(SQLModel):
    id: int | None = Field(default=None, primary_key=True)


class Game(GameBase, table=True):
    user_id: int = Field(foreign_key='user.id', index=True)
    mode: str
    round_count: int # Stored as log data, even though can be calculated.
    completed_at: datetime
    score: int # Stored as log data, even though can be calculated.


class Round(GameBase, table=True):
    game_id: int = Field(foreign_key='game.id', index=True)
    round: int = Field(unique=True)
    photo_link: str
    taxon_id: int
    score: int # Stored as log data, even though can be calculated.


class Answer(GameBase, table=True):
    round_id: int = Field(foreign_key='round.id', index=True)
    rank: str
    user_answer: str | None
    correct_answer: str
    correct: bool


class AnswerIn(BaseModel):
    userAnswer: str
    correctAnswer: str
    correct: bool


class RoundIn(BaseModel):
    round: int
    photoLink: str
    taxonId: int
    family: AnswerIn
    genus: AnswerIn
    specEpithet: AnswerIn
    score: int


class GameIn(BaseModel):
    mode: str
    maxRound: int
    totalScore: int
    currentRound: int
    submitted: bool
    completed: bool
    completedAt: datetime
    rounds: list[RoundIn]