from routers.auth import get_current_user
from database import AnswerDB, get_session, GameDB, RoundDB
from fastapi import APIRouter, Depends, HTTPException, status
from models.game import Answer, Game, GameIn, Round
from models.user import UserBase, User
from sqlmodel import Session
from typing import Annotated


router = APIRouter(
    prefix='/users'
)


@router.get('/current', response_model=UserBase)
def read_current_user(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user


@router.post('/current/games', status_code=status.HTTP_201_CREATED)
def create_game(data: GameIn, current_user: Annotated[User, Depends(get_current_user)], session: Session = Depends(get_session)):
    try:
        assert current_user.id is not None
        game = Game(user_id=current_user.id, mode=data.mode, round_count=data.maxRound, completed_at=data.completedAt, score=data.totalScore)
        game_db = GameDB(session=session)
        game = game_db.create(game)
        assert game.id is not None

        for r in data.rounds:
            round_ = Round(game_id=game.id, round=r.round, photo_link=r.photoLink, taxon_id=r.taxonId, score=r.score)
            round_db = RoundDB(session=session)
            round_ = round_db.create(round_)
            assert round_.id is not None

            family_answer = Answer(round_id=round_.id, rank='family', user_answer=r.family.userAnswer, correct_answer=r.family.correctAnswer, correct=r.family.correct)
            genus_answer = Answer(round_id=round_.id, rank='genus', user_answer=r.genus.userAnswer, correct_answer=r.genus.correctAnswer, correct=r.genus.correct)
            species_answer = Answer(round_id=round_.id, rank='species', user_answer=r.specEpithet.userAnswer, correct_answer=r.specEpithet.correctAnswer, correct=r.specEpithet.correct)
            
            answer_db = AnswerDB(session=session)
            family_answer = answer_db.create(family_answer)
            genus_answer = answer_db.create(genus_answer)
            species_answer = answer_db.create(species_answer)
    except:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to create the game.')

    return {'message': 'Successfully created.'}


@router.get('/current/games')
def read_games_by_user(current_user: Annotated[User, Depends(get_current_user)], offset: int = 0, limit: int | None = None, session: Session = Depends(get_session)):
    game_db = GameDB(session=session)
    assert current_user.id is not None
    results = game_db.read_by_user(user_id=current_user.id, offset=offset, limit=limit)

    return results