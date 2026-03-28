from database import get_session, UserDB
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from models.token import Token
from models.user import User, UserIn
import os
from pwdlib import PasswordHash
from sqlmodel import Session
from typing import Annotated


router = APIRouter(
    prefix='/auth'
)

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash('This is a dummy password.')
load_dotenv() # Loads environment variables for handling JWTs.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')


def verify_password(password: str, hash: str) -> bool:
    return password_hash.verify(password, hash)


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=[str(os.getenv('JWT_ALGORITHM'))])
        user_id = payload.get('sub')
        assert user_id is not None
        user_id = int(user_id)
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token.')
    
    # (Check if the token expires.)

    user_db = UserDB(session=session)
    user = user_db.read(user_id)

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found.')
    
    return user


LoginException = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Incorrect username or password.')

@router.post('/login', response_model=Token)
def login(data: Annotated[OAuth2PasswordRequestForm, Depends()], session: Session = Depends(get_session)):
    user_db = UserDB()
    user = user_db.read_by_name(data.username)

    # Authenticates the user.
    if user is None:
        verify_password(data.password, DUMMY_HASH) # Verify with a dummy hash when no users are matched to avoid timing attacks.
        raise LoginException
    elif not verify_password(data.password, user.password):
        raise LoginException
    
    # Creates an encoded JWT.
    expiration_time = datetime.now(timezone.utc) + timedelta(minutes=float(os.getenv('JWT_EXPIRATION_TIME', 60)))
    payload = {'sub': str(user.id), 'exp': expiration_time}
    encoded_jwt = jwt.encode(payload=payload, key=os.getenv('JWT_SECRET_KEY'), algorithm=os.getenv('JWT_ALGORITHM'))
    
    return {'access_token': encoded_jwt, 'token_type': 'bearer'}


@router.post('/signup', status_code=status.HTTP_201_CREATED)
def signup(data: UserIn, session: Session = Depends(get_session)):
    user_db = UserDB(session=session)
    existing_user = user_db.read_by_name(data.username)

    if existing_user is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Username already exists.')
    
    hashed_password = password_hash.hash(data.password)
    user = User(name=data.username, password=hashed_password)
    try:
        user = user_db.create(user)
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Failed to create the user.')

    return {'message': 'Successfully created.'}