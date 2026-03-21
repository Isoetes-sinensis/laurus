from models.user import User
from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()


def get_user(name: str) -> User | None:
    user = User(id=123, name='testuser', password=password_hash.hash('testpwd'))
    return user