from database import AnswerDB
from fastapi import APIRouter


router = APIRouter(
    prefix='/answers'
)


@router.get('/{answer_id}')
def read_answer(answer_id: int):
    answer = AnswerDB()
    result = answer.read(answer_id)
    return result