from database import get_user
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import jwt
from models.token import Token
import os
from pwdlib import PasswordHash
from typing import Annotated


router = APIRouter(
    prefix='/auth'
)

password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash('This is a dummy password.')

load_dotenv() # Load environment variables for handling JWTs.


def verify_password(password: str, hash: str) -> bool:
    return password_hash.verify(password, hash)


LoginException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail='Incorrect username or password.'
)


@router.post('/login', response_model=Token)
def login(data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = get_user(data.username)

    # Authenticate.
    if user is None:
        verify_password(data.password, DUMMY_HASH) # Verify with a dummy hash when no users are matched to avoid timing attacks.
        raise LoginException
    elif not verify_password(data.password, user.password):
        raise LoginException
    
    # Create an encoded JWT.
    expiration_time = datetime.now(timezone.utc) + timedelta(minutes=float(os.getenv('JWT_EXPIRATION_TIME', 60)))
    payload = {'sub': user.name, 'exp': expiration_time}
    encoded_jwt = jwt.encode(payload=payload, key=os.getenv('JWT_SECRET_KEY'), algorithm=os.getenv('JWT_ALGORITHM'))
    
    return {'access_token': encoded_jwt, 'token_type': 'bearer'}