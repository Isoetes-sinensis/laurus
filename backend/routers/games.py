from database import AnswerDB, GameDB, get_session, RoundDB
from fastapi import APIRouter, Depends, HTTPException, status
from models.game import Answer, Game, GameIn, Round
from sqlmodel import Session


router = APIRouter(
    prefix='/games'
)

DUMMY_CURRENT_USER = 123


@router.post('/', status_code=status.HTTP_201_CREATED)
def create_game(data: GameIn, session: Session = Depends(get_session)):
    try:
        game = Game(user_id=DUMMY_CURRENT_USER, mode=data.mode, round_count=data.maxRound, completed_at=data.completedAt, score=data.totalScore)
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