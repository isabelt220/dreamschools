from flask import Flask
from flask_bcrypt import Bcrypt
import boto3
from config import DB_USERNAME, DB_PASSWORD, DB_NAME, S3_ACCESS_KEY, S3_SECRET_KEY


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://{}:{}@localhost/{}'.format(DB_USERNAME, DB_PASSWORD, DB_NAME)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
bcrypt = Bcrypt(app)

from models import db

db.init_app(app)
with app.app_context():
    db.create_all()

s3 = boto3.client(
    "s3",
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY
)

from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.user_controller import user_controller
from api.school_controller import school_controller
from api.email_controller import email_controller

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(user_controller)
app.register_blueprint(school_controller)
app.register_blueprint(email_controller)
