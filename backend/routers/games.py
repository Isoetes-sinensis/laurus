from database import GameDB
from fastapi import APIRouter


router = APIRouter(
    prefix='/games'
)


@router.get('/')
def read_games(offset: int = 0, limit: int | None = None):
    game = GameDB()
    result = game.read_all(offset=offset, limit=limit)
    return result


@router.get('/{game_id}')
def read_game(game_id: int):
    game = GameDB()
    result = game.read(game_id)
    return result