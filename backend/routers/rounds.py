from database import RoundDB
from fastapi import APIRouter


router = APIRouter(
    prefix='/rounds'
)


@router.get('/{round_id}')
def read_round(round_id: int):
    round_ = RoundDB()
    result = round_.read(round_id)
    return result