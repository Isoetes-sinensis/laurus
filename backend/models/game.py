from datetime import datetime
from sqlmodel import SQLModel, Field


class Game(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key='user.id', index=True)
    mode: str
    rounds: int # Stored as log data, even though can be calculated.
    completed_at: datetime
    score: int # Stored as log data, even though can be calculated.