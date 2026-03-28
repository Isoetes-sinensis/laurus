from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class UserBase(SQLModel):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)


class User(UserBase, table=True):
    password: str


class UserIn(BaseModel):
    username: str
    password: str