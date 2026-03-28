from models.game import Answer, Game, GameBase, Round
from models.user import User
from sqlmodel import create_engine, select, Session, SQLModel
from typing import Generic, Sequence, Type, TypeVar


sqlite_url = f'sqlite:///database.db'
engine = create_engine(sqlite_url, echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


class UserDB:
    def __init__(self, session: Session | None = None) -> None:
        if session is None:
            self.session = Session(engine)
        else:
            self.session = session

    def create(self, model: User) -> User:
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)
        return model
    
    def read(self, id: int) -> User | None:
        result = self.session.exec(select(User).where(User.id == id)).first()
        return result
    
    def read_by_name(self, name: str) -> User | None:
        result = self.session.exec(select(User).where(User.name == name)).first()
        return result


T = TypeVar('T', bound=GameBase)

class GameBaseDB(Generic[T]):
    '''
    Base database class for simple CRUDs.
    Can be used for any classes extending `GameBase` (i.e. with `id` field as primary key).
    Need to close `self.session` manually after using the class.
    '''

    def __init__(self, model_type: Type[T], session: Session | None = None) -> None:
        self.model_type = model_type
        if session is None:
            self.session = Session(engine)
        else:
            self.session = session

    def create(self, model: T) -> T:
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)
        return model

    def read(self, id: int) -> T | None:
        result = self.session.exec(select(self.model_type).where(self.model_type.id == id)).first()
        return result
    
    def read_all(self, offset: int = 0, limit: int | None = None) -> Sequence[T]:
        results =  self.session.exec(select(self.model_type).offset(offset).limit(limit)).all()
        return results
    
    def _read_by_parent_id(self, field, id: int, offset: int = 0, limit: int | None = None) -> Sequence[T]:
        '''
        Args:
            field: A field in a SQLModel corresponding to a foreign key, e.g. `Game.user_id`.
        '''
        
        results = self.session.exec(select(self.model_type).where(field == id).offset(offset).limit(limit)).all()
        return results


class GameDB(GameBaseDB[Game]):
    def __init__(self, session: Session | None = None) -> None:
        super().__init__(Game, session)

    def read_by_user(self, user_id: int, offset: int = 0, limit: int | None = None) -> Sequence[Game]:
        return self._read_by_parent_id(field=Game.user_id, id=user_id, offset=offset, limit=limit)


class RoundDB(GameBaseDB[Round]):
    def __init__(self, session: Session | None = None) -> None:
        super().__init__(Round, session)

    def read_by_game(self, game_id: int, offset: int = 0, limit: int | None = None) -> Sequence[Round]:
        return self._read_by_parent_id(field=Game.user_id, id=game_id, offset=offset, limit=limit)


class AnswerDB(GameBaseDB[Answer]):
    def __init__(self, session: Session | None = None) -> None:
        super().__init__(Answer, session)
    
    def read_by_round(self, round_id: int, offset: int = 0, limit: int | None = None) -> Sequence[Answer]:
        return self._read_by_parent_id(field=Game.user_id, id=round_id, offset=offset, limit=limit)