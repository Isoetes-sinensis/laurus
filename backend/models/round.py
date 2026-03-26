from sqlmodel import SQLModel, Field


class Round(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    game_id: int = Field(foreign_key='game.id', index=True)
    round: int = Field(unique=True)
    photo_link: str
    taxon_id: int
    score: int # Stored as log data, even though can be calculated.


class Answer(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    round_id: int = Field(foreign_key='round.id', index=True)
    rank: str
    user_answer: str | None
    correct_answer: str
    correct: bool