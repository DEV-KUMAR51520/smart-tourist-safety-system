import os
from datetime import timedelta

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', "postgresql://admin:dev123@localhost:5432/tourist_safety")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET', 'your_jwt_secret_key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
