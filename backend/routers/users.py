from routers.auth import get_current_user
from database import get_session, GameDB
from fastapi import APIRouter, Depends
from models.user import UserBase, User
from sqlmodel import Session
from typing import Annotated


router = APIRouter(
    prefix='/users'
)


@router.get('/current', response_model=UserBase)
def read_current_user(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user


@router.get('/current/games')
def read_games_by_user(current_user: Annotated[User, Depends(get_current_user)], offset: int = 0, limit: int | None = None, session: Session = Depends(get_session)):
    game_db = GameDB(session=session)
    assert current_user.id is not None
    results = game_db.read_by_user(user_id=current_user.id, offset=offset, limit=limit)

    return results