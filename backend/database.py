from models.user import User
from pwdlib import PasswordHash
from sqlmodel import create_engine, SQLModel


sqlite_url = f'sqlite:///database.db'
engine = create_engine(sqlite_url, echo=True)

password_hash = PasswordHash.recommended()


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_user(name: str) -> User | None:
    user = User(id=123, name='testuser', password=password_hash.hash('testpwd'))
    return user