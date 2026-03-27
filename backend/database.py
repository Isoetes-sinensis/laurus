from datetime import datetime
from models.game import Answer, Game, GameBase, Round
from models.user import User
from pwdlib import PasswordHash
from sqlmodel import create_engine, select, Session, SQLModel
from typing import Generic, Sequence, Type, TypeVar


sqlite_url = f'sqlite:///database.db'
engine = create_engine(sqlite_url, echo=True)

password_hash = PasswordHash.recommended()


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_user(name: str) -> User | None:
    user = User(id=123, name='testuser', password=password_hash.hash('testpwd'))
    return user


T = TypeVar('T', bound=GameBase)

class GameBaseDB(Generic[T]):
    '''
    Base database class for simple CRUDs.
    Can be used for any classes extending `GameBase` (i.e. with `id` field as primary key).
    '''

    def __init__(self, model_type: Type[T]) -> None:
        self.model_type = model_type

    def create(self, model: T) -> T:
        with Session(engine) as session:
            session.add(model)
            session.commit()
            session.refresh(model)
        return model

    def read(self, id: int) -> T | None:
        with Session(engine) as session:
            result = session.exec(select(self.model_type).where(self.model_type.id == id)).first()
        return result
    
    def read_all(self, offset: int = 0, limit: int | None = None) -> Sequence[T]:
        with Session(engine) as session:
            results =  session.exec(select(self.model_type).offset(offset).limit(limit)).all()
        return results
    
    def _read_by_parent_id(self, field, id: int, offset: int = 0, limit: int | None = None) -> Sequence[T]:
        '''
        Args:
            field: A field in a SQLModel corresponding to a foreign key, e.g. `Game.user_id`.
        '''
        
        with Session(engine) as session:
            results = session.exec(select(self.model_type).where(field == id).offset(offset).limit(limit)).all()
        return results


class GameDB(GameBaseDB[Game]):
    def __init__(self):
        super().__init__(Game)

    def read_by_user(self, user_id: int, offset: int = 0, limit: int | None = None) -> Sequence[Game]:
        return self._read_by_parent_id(field=Game.user_id, id=user_id, offset=offset, limit=limit)


class RoundDB(GameBaseDB[Round]):
    def __init__(self):
        super().__init__(Round)

    def read_by_game(self, game_id: int, offset: int = 0, limit: int | None = None) -> Sequence[Round]:
        return self._read_by_parent_id(field=Game.user_id, id=game_id, offset=offset, limit=limit)


class AnswerDB(GameBaseDB[Answer]):
    def __init__(self):
        super().__init__(Answer)
    
    def read_by_round(self, round_id: int, offset: int = 0, limit: int | None = None) -> Sequence[Answer]:
        return self._read_by_parent_id(field=Game.user_id, id=round_id, offset=offset, limit=limit)