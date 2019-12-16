from flask import Blueprint, jsonify, request
from config import SENDGRID_API_KEY, SECRET_KEY, TEST_EMAIL1, TEST_EMAIL2
from itsdangerous import URLSafeTimedSerializer
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, TemplateId
from models import db, User
import json

email_controller = Blueprint('email_controller', __name__, url_prefix='/email')


@email_controller.route('/forgot-password', methods=['POST'])
def forgot_password():
    body = json.loads(request.get_data())
    user_email = body["email"]

    try:
        # check if user email exists in database
        User.query.filter(User.email == user_email).first_or_404()
    except Exception:
        return jsonify({"Error": "Invalid email address"})

    password_reset_serializer = URLSafeTimedSerializer(SECRET_KEY)
    password_reset_url = ('http://localhost:3000/reset-password/' +
                          password_reset_serializer.dumps(user_email, salt='password-reset-salt'))

    message = Mail(
        from_email=TEST_EMAIL1,
        to_emails=user_email,
        subject='Reset your password',
        html_content='Link to reset password')
    message.template_id = TemplateId("d-582022551b084a2ba6e05b439ec5d1ee")
    message.dynamic_template_data = {"password_reset_url": password_reset_url}
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)
    except Exception:
        return jsonify({"Error": "Failed to send reset password email"})
    return jsonify({"Success": "Reset password email sent"})


def welcome_email(user_email):
    message = Mail(
        from_email=TEST_EMAIL1,
        to_emails=user_email,
        subject='Welcome to Receipt Tracker')
    message.template_id = TemplateId("d-e41c2451bbcb4d3781cde06c0e915fd8")
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)
    except Exception:
        return jsonify({"Error": "Failed to send welcome email"})
    return jsonify({"Success": "Welcome email sent"})
