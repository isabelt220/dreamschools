from flask import Blueprint, request, jsonify
from itsdangerous import URLSafeTimedSerializer
from config import SECRET_KEY
from app import bcrypt
from models import db, User
import jwt, json, re
import api.email_controller as ec

user_controller = Blueprint('user_controller', __name__)


@user_controller.route('/signup', methods=['POST'])
def signup():
    body = json.loads(request.get_data())
    EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
    if EMAIL_REGEX.match(body['email']) is None:
        return jsonify({'Error': 'Please enter a valid email'})
    if len(body['password']) < 6:
        return jsonify({'Error': 'Password must be 6 letters or more'})

    user = User(email=body['email'], password=body['password'])
    try:
        db.session.add(user)
        db.session.commit()
    except Exception:
        return jsonify({'Error': 'Account already exists'})

    ec.welcome_email(body['email'])
    token = jwt.encode(body, SECRET_KEY).decode('utf-8')
    return jsonify({'token': token})


@user_controller.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        body = json.loads(request.get_data())
        find_user = User.query.filter_by(email=body['email']).first()
        if find_user:
            is_authenticated = bcrypt.check_password_hash(find_user.password, body['password'])
            if is_authenticated:
                token = jwt.encode(body, SECRET_KEY).decode('utf-8')
                return jsonify({'token': token})
            else:
                return jsonify({'Error': 'Invalid credentials'})
        else:
            return jsonify({'Error': 'Invalid credentials'})
    return jsonify({'Error': 'Invalid credentials'})


@user_controller.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password_with_token(token):
    try:
        password_reset_serializer = URLSafeTimedSerializer(SECRET_KEY)
        user_email = password_reset_serializer.loads(token,
                                                     salt='password-reset-salt',
                                                     max_age=3600)
    except Exception:
        return jsonify({'Error': 'The password reset link is invalid or has expired'})

    body = json.loads(request.get_data())
    new_password = body['password']
    confirm_password = body['confirmPassword']

    if new_password != confirm_password:
        return jsonify({'Error': 'New password and confirm password does not match'})

    if len(new_password) < 6:
        return jsonify({'Error': 'Password must be 6 letters or more'})

    try:
        user = User.query.filter(User.email == user_email).first_or_404()
    except Exception:
        return jsonify({'Error': 'Invalid email address'})

    user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.add(user)

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        db.session.flush()
        return jsonify({'Error': 'Failed to update password'})

    return jsonify({'Success': 'Password updated'})


def get_all_users():
    all_users = User.query.all()
    return jsonify(users=[user.to_dict() for user in all_users])


def decode_auth_token(auth_header):
    auth_token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(auth_token, SECRET_KEY)
        user_entry = User.query.filter(User.email == payload['email']).first_or_404()
        user_id = user_entry.id
        return user_id
    except jwt.ExpiredSignatureError:
        return jsonify({'Error': 'Signature expired. Please log in again.'})
    except jwt.InvalidTokenError:
        return jsonify({'Error': 'Invalid token. Please log in again.'})
