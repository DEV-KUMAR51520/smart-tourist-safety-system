# backend/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # # Register blueprints
    # from app.routes.auth import auth_bp
    # from app.routes.location import location_bp
    # from app.routes.emergency import emergency_bp
    # from app.routes.dashboard import dashboard_bp

    # app.register_blueprint(auth_bp, url_prefix='/api/auth')
    # app.register_blueprint(location_bp, url_prefix='/api/location')
    # app.register_blueprint(emergency_bp, url_prefix='/api/emergency')
    # app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

    return app