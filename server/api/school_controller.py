from flask import Blueprint, request, jsonify
from models import db, School
from config import S3_LOCATION, S3_BUCKET_NAME
from werkzeug import secure_filename
from app import s3
import api.user_controller as uc
school_controller = Blueprint('school_controller', __name__, url_prefix='/school')


@school_controller.route('/', methods=['POST'])
def create():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        user_id = uc.decode_auth_token(auth_header)
        if not isinstance(user_id, int):
            return jsonify({"Error": "Failed to authenticate"})
    else:
        return jsonify({"Error": "Failed to authenticate"})

    school_data = request.json

    school_name = school_data['school_name']
    about = school_data['about']
    location = school_data['location']
    admission = school_data['admission']
    image_url = school_data['image_url']

    # try:
    #     image_data = request.files.getlist('files')
    # except Exception:
    #     return jsonify({'Error': 'Failed to get files'})

    # image_location = ''
    # try:
    #     # for image in image_data:
    #     filename = secure_filename(image_url[0].filename)
    #     image_url[0].save(filename)
    #     s3.upload_file(
    #         Bucket=S3_BUCKET_NAME,
    #         Filename=filename,
    #         Key=filename
    #     )
    #     image_location = '{}{}'.format(S3_LOCATION, filename)
    # except Exception as e:
    #     return jsonify({'Error': str(request.files.getlist('image_url'))})

    school = School(school_name=school_name, about=about, location=location, admission=admission, image_url=image_url, user_id=user_id)
    db.session.add(school)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        db.session.flush()
        return jsonify({'Error': str(e)})

    return jsonify({'Success': 'New school entry created'})


@school_controller.route('/', methods=['GET'])
def get_all_schools():
    schools = School.query.order_by(School.id.desc()).all()

    return jsonify(schools=[school.to_dict() for school in schools])


@school_controller.route('/<int:school_id>', methods=['GET'])
def get_school(school_id):
    school = School.query.get_or_404(school_id)

    return jsonify(school.to_dict())


@school_controller.route('/<int:school_id>', methods=['PATCH', 'PUT'])
def update(school_id):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        user_id = uc.decode_auth_token(auth_header)
        if not isinstance(user_id, int):
            return jsonify({"Error": "Failed to authenticate"})
    else:
        return jsonify({"Error": "Failed to authenticate"})

    school_data = request.json

    school = School.query.get_or_404(school_id)

    school.school_name = school_data['school_name']
    school.about = school_data['about']
    school.location = school_data['location']
    school.admission = school_data['admission']
    school.image_url = school_data['image_url']
    school.user_id = user_id

    db.session.add(school)

    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
        db.session.flush()
        return jsonify({'Error': 'Failed to update school information'})

    return jsonify({'Success': 'School information updated'})


@school_controller.route('/images', methods=['POST'])
def upload_images():
    all_images = request.files.getlist('files')
    image_locations = []
    try:
        for image in all_images:
            filename = secure_filename(image.filename)
            image.save(filename)
            s3.upload_file(
                Bucket=S3_BUCKET_NAME,
                Filename=filename,
                Key=filename
            )
            image_locations.append("{}{}".format(S3_LOCATION, filename))
        return jsonify({'location': image_locations})
    except Exception as e:
        print(e)
        return jsonify({'Error': 'Failed to upload image(s)'})
