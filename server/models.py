from flask_sqlalchemy import SQLAlchemy
from app import bcrypt

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    schools = db.relationship('School', backref='user')

    def __init__(self, email, password):
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def __repr__(self):
        return '<User %r>' % self.email

    def to_dict(self):
        return {'id': self.id,
                'email': self.email,
                'password': self.password}


class School(db.Model):
    __tablename__ = 'school'

    id = db.Column(db.Integer, primary_key=True)

    school_name = db.Column(db.String(200), unique=True, nullable=False)
    about = db.Column(db.Text, unique=False, nullable=False)
    location = db.Column(db.Text, unique=False, nullable=False)
    admission = db.Column(db.Text, unique=False, nullable=False)
    image_url = db.Column(db.String(200), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __init__(self, school_name, about, location, admission, image_url, user_id):
        self.school_name = school_name
        self.about = about
        self.location = location
        self.admission = admission
        self.image_url = image_url
        self.user_id = user_id

    def __repr__(self):
        return 'School %s, Name: %s' % (self.id, self.school_name)

    def to_dict(self):
        return {'id': self.id,
                'school_name': self.school_name,
                'about': self.about,
                'location': self.location,
                'admission': self.admission,
                'image_url': self.image_url}
