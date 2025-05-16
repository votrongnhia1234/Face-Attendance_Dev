import boto3
from flask import Flask, request, jsonify
from flask_cors import CORS
from botocore.exceptions import ClientError
from datetime import datetime, timedelta
from dotenv import load_dotenv
from boto3.dynamodb.conditions import Key
import os
import jwt
import logging
import bcrypt

load_dotenv()

# Cấu hình Flask
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # Giới hạn 2MB

# Thiết lập logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Cấu hình AWS và JWT từ biến môi trường
AWS_REGION = os.getenv('AWS_REGION')
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')
SECRET_KEY = os.getenv('SECRET_KEY')
collection_id = 'face-attendance-collection'
app.config['SECRET_KEY'] = SECRET_KEY

# Khởi tạo các client AWS
rekognition = boto3.client('rekognition', region_name=AWS_REGION)
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)
s3_client = boto3.client('s3', region_name=AWS_REGION)

# ======================= MIDDLEWARE =======================
def check_authorization(required_role):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Thiếu token xác thực'}), 401

    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        if required_role and payload.get('role') != required_role:
            return jsonify({'error': f'Không có quyền truy cập, yêu cầu vai trò: {required_role}'}), 403
        request.user = payload
        return None
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token hết hạn'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token không hợp lệ'}), 401

# ======================= ROUTES =======================

@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    logging.debug(f"Received admin login request: {data}")
    admin_id = data.get('admin_id')
    password = data.get('password')

    if not admin_id or not password:
        logging.error("Missing admin_id or password")
        return jsonify({'error': 'Thiếu admin_id hoặc password'}), 400

    try:
        table = dynamodb.Table('Users')
        response = table.get_item(Key={'user_id': admin_id})
        user = response.get('Item')
        logging.debug(f"User data: {user}")

        if not user or user['role'] != 'admin':
            logging.error(f"Admin not found or invalid role for {admin_id}")
            return jsonify({'error': 'Không tìm thấy admin'}), 404

        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            logging.error(f"Password mismatch for {admin_id}")
            return jsonify({'error': 'Sai mật khẩu'}), 401

        token = jwt.encode(
            {'user_id': admin_id, 'role': 'admin', 'exp': datetime.utcnow() + timedelta(hours=24)},
            SECRET_KEY,
            algorithm='HS256'
        )
        logging.info(f"Admin login successful for {admin_id}")
        return jsonify({'token': token})
    except Exception as e:
        logging.exception("Admin login error")
        return jsonify({'error': 'Lỗi hệ thống khi đăng nhập'}), 500

@app.route('/teacher/login', methods=['POST'])
def teacher_login():
    data = request.get_json()
    logging.debug(f"Received teacher login request: {data}")
    teacher_id = data.get('teacher_id')
    password = data.get('password')

    if not teacher_id or not password:
        logging.error("Missing teacher_id or password")
        return jsonify({'error': 'Thiếu teacher_id hoặc password'}), 400

    try:
        table = dynamodb.Table('Users')
        response = table.get_item(Key={'user_id': teacher_id})
        user = response.get('Item')
        logging.debug(f"User data: {user}")

        if not user or user['role'] != 'teacher':
            logging.error(f"Teacher not found or invalid role for {teacher_id}")
            return jsonify({'error': 'Không tìm thấy giáo viên'}), 404

        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            logging.error(f"Password mismatch for {teacher_id}")
            return jsonify({'error': 'Sai mật khẩu'}), 401

        token = jwt.encode(
            {'user_id': teacher_id, 'role': 'teacher', 'exp': datetime.utcnow() + timedelta(hours=24)},
            SECRET_KEY,
            algorithm='HS256'
        )
        logging.info(f"Teacher login successful for {teacher_id}")
        return jsonify({'token': token})
    except Exception as e:
        logging.exception("Teacher login error")
        return jsonify({'error': 'Lỗi hệ thống khi đăng nhập'}), 500

@app.route('/student/login', methods=['POST'])
def student_login():
    data = request.get_json()
    logging.debug(f"Received student login request: {data}")
    student_id = data.get('student_id')
    password = data.get('password')

    if not student_id or not password:
        logging.error("Missing student_id or password")
        return jsonify({'error': 'Thiếu student_id hoặc password'}), 400

    try:
        table = dynamodb.Table('Users')
        response = table.get_item(Key={'user_id': student_id})
        user = response.get('Item')
        logging.debug(f"User data: {user}")

        if not user or user['role'] != 'student':
            logging.error(f"Student not found or invalid role for {student_id}")
            return jsonify({'error': 'Không tìm thấy sinh viên'}), 404

        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            logging.error(f"Password mismatch for {student_id}")
            return jsonify({'error': 'Sai mật khẩu'}), 401

        token = jwt.encode(
            {'user_id': student_id, 'role': 'student', 'exp': datetime.utcnow() + timedelta(hours=24)},
            SECRET_KEY,
            algorithm='HS256'
        )
        logging.info(f"Student login successful for {student_id}")
        return jsonify({'token': token})
    except Exception as e:
        logging.exception("Student login error")
        return jsonify({'error': 'Lỗi hệ thống khi đăng nhập'}), 500

@app.route('/me', methods=['GET'])
def get_user():
    auth_result = check_authorization(None)
    if auth_result:
        return auth_result
    return jsonify({'user_id': request.user['user_id'], 'role': request.user['role']})

@app.route('/admin/register', methods=['POST'])
def admin_register():
    # auth_result = check_authorization('admin')
    # if auth_result:
    #     return auth_result

    data = request.get_json()
    admin_id = data.get('admin_id')
    name = data.get('name', admin_id)
    password = data.get('password')

    if not admin_id or not password:
        return jsonify({'error': 'Thiếu admin_id hoặc password'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        table = dynamodb.Table('Users')
        response = table.get_item(Key={'user_id': admin_id})
        if response.get('Item'):
            return jsonify({'error': 'Admin ID đã tồn tại'}), 400

        table.put_item(
            Item={
                'user_id': admin_id,
                'name': name,
                'role': 'admin',
                'password': hashed_password
            }
        )
        return jsonify({'message': f'Đăng ký admin thành công: {admin_id}'})
    except Exception as e:
        logging.exception("Admin register error")
        return jsonify({'error': 'Lỗi hệ thống khi đăng ký admin'}), 500

@app.route('/teacher/register', methods=['POST'])
def teacher_register():
    auth_result = check_authorization('admin')
    if auth_result:
        return auth_result

    data = request.get_json()
    teacher_id = data.get('teacher_id')
    name = data.get('name', teacher_id)
    password = data.get('password')
    class_id = data.get('class_id', '')

    if not teacher_id or not password:
        return jsonify({'error': 'Thiếu teacher_id hoặc password'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        table = dynamodb.Table('Users')
        response = table.get_item(Key={'user_id': teacher_id})
        if response.get('Item'):
            return jsonify({'error': 'Teacher ID đã tồn tại'}), 400

        table.put_item(
            Item={
                'user_id': teacher_id,
                'name': name,
                'role': 'teacher',
                'class_id': class_id,
                'password': hashed_password
            }
        )
        return jsonify({'message': f'Đăng ký giáo viên thành công: {teacher_id}'})
    except Exception as e:
        logging.exception("Teacher register error")
        return jsonify({'error': 'Lỗi hệ thống khi đăng ký giáo viên'}), 500

@app.route('/register', methods=['POST'])
def register():
    auth_result = check_authorization('teacher')
    if auth_result:
        auth_result = check_authorization('admin')
        if auth_result:
            return auth_result

    if 'image' not in request.files or 'student_id' not in request.form:
        return jsonify({'error': 'Thiếu ảnh hoặc mã sinh viên'}), 400

    image = request.files['image']
    if not image.content_type.startswith('image/'):
        return jsonify({'error': 'Tệp không phải ảnh'}), 400

    student_id = request.form['student_id']
    name = request.form.get('name', student_id)
    class_id = request.form.get('class_id', '')
    role = request.form.get('role', 'student')
    password = request.form.get('password')
    if not password:
        return jsonify({'error': 'Mật khẩu là bắt buộc'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
    # Đọc ảnh vào RAM trước khi upload
        image.seek(0)
        image_bytes = image.read()

        # Upload ảnh lên S3 (dùng BytesIO để giữ nguyên image_bytes)
        from io import BytesIO
        s3_key = f'faces/{student_id}_{datetime.now().strftime("%Y%m%d%H%M%S")}.jpg'
        s3_client.upload_fileobj(BytesIO(image_bytes), S3_BUCKET_NAME, s3_key)
    except Exception as e:
        logging.exception(f"Upload S3 error: {str(e)}")
        return jsonify({'error': f'Lỗi lưu ảnh lên S3: {str(e)}'}), 500


    try:
        response = rekognition.index_faces(
        CollectionId=collection_id,
        Image={'Bytes': image_bytes},
        ExternalImageId=student_id,
        DetectionAttributes=['ALL']
    )
        if not response['FaceRecords']:
            return jsonify({'error': 'Không phát hiện khuôn mặt trong ảnh'}), 400
    except  Exception as e:
        logging.exception(f"Rekognition error: {str(e)}")
        return jsonify({'error': f'Lỗi xử lý ảnh với Rekognition: {str(e)}'}), 500


    try:
        table = dynamodb.Table('Users')
        response = table.get_item(Key={'user_id': student_id})
        if response.get('Item'):
            return jsonify({'error': 'Student ID đã tồn tại'}), 400

        table.put_item(
            Item={
                'user_id': student_id,
                'name': name,
                'class_id': class_id,
                'role': role,
                'password': hashed_password
            }
        )
        return jsonify({'message': f'Đăng ký sinh viên thành công: {student_id}'})
    except Exception as e:
        logging.exception("DynamoDB save error")
        return jsonify({'error': 'Lỗi lưu thông tin vào DynamoDB'}), 500

@app.route('/attendance', methods=['POST'])
def attendance():
    auth_result = check_authorization('student')
    if auth_result:
        return auth_result

    if 'image' not in request.files:
        return jsonify({'error': 'Thiếu ảnh'}), 400

    image = request.files['image']
    if not image.content_type.startswith('image/'):
        return jsonify({'error': 'Tệp không phải ảnh'}), 400

    try:
        image_bytes = image.read()
        response = rekognition.search_faces_by_image(
            CollectionId=collection_id,
            Image={'Bytes': image_bytes},
            MaxFaces=1,
            FaceMatchThreshold=80
        )
    except Exception as e:
        logging.exception("Rekognition search error")
        return jsonify({'error': 'Lỗi nhận diện khuôn mặt'}), 500

    if response['FaceMatches']:
        student_id = response['FaceMatches'][0]['Face']['ExternalImageId']
        timestamp = datetime.utcnow().isoformat() + 'Z'
        try:
            users_table = dynamodb.Table('Users')
            user_data = users_table.get_item(Key={'user_id': student_id})
            user = user_data.get('Item')
            if not user:
                return jsonify({'error': 'Sinh viên chưa đăng ký'}), 404

            attendance_table = dynamodb.Table('Attendance')
            attendance_table.put_item(
                Item={
                    'student_id': student_id,
                    'name': user.get('name'),
                    'class_id': user.get('class_id'),
                    'timestamp': timestamp
                }
            )
            return jsonify({
                'message': f'Điểm danh thành công: {student_id}',
                'student_id': student_id,
                'name': user.get('name'),
                'timestamp': timestamp
            })
        except Exception as e:
            logging.exception("Attendance save error")
            return jsonify({'error': 'Lỗi lưu thông tin điểm danh'}), 500
    else:
        return jsonify({'error': 'Không nhận diện được khuôn mặt'}), 404

@app.route('/history', methods=['GET'])
def history():
    auth_result = check_authorization(None)
    if auth_result:
        return auth_result

    role = request.user.get('role')
    if role not in ['admin', 'teacher']:
        return jsonify({'error': 'Không có quyền truy cập'}), 403

    try:
        attendance_table = dynamodb.Table('Attendance')
        limit = int(request.args.get('limit', 100))
        last_evaluated_key = request.args.get('last_key')

        scan_kwargs = {'Limit': limit}
        if last_evaluated_key:
            scan_kwargs['ExclusiveStartKey'] = {'student_id': last_evaluated_key}

        scan_result = attendance_table.scan(**scan_kwargs)
        records = sorted(scan_result.get('Items', []), key=lambda x: x['timestamp'], reverse=True)
        last_key = scan_result.get('LastEvaluatedKey', {}).get('student_id')

        return jsonify({'records': records, 'last_key': last_key})
    except Exception as e:
        logging.exception("History fetch error")
        return jsonify({'error': 'Lỗi lấy lịch sử điểm danh'}), 500


@app.route('/users', methods=['GET'])
def get_users():
    auth_result = check_authorization('admin')
    if auth_result:
        return auth_result

    role = request.args.get('role')
    try:
        table = dynamodb.Table('Users')
        if role in ['student', 'teacher']:
            scan_result = table.scan(
                FilterExpression='#r = :role',
                ExpressionAttributeNames={'#r': 'role'},
                ExpressionAttributeValues={':role': role}
            )
        else:
            scan_result = table.scan()

        users = scan_result.get('Items', [])
        return jsonify(users)
    except Exception as e:
        logging.exception("Get users error")
        return jsonify({'error': 'Lỗi lấy danh sách người dùng'}), 500


@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    auth_result = check_authorization('admin')
    if auth_result:
        return auth_result

    try:
        table = dynamodb.Table('Users')
        response = table.get_item(Key={'user_id': user_id})
        if not response.get('Item'):
            return jsonify({'error': 'Không tìm thấy người dùng'}), 404

        table.delete_item(Key={'user_id': user_id})
        return jsonify({'message': f'Xóa người dùng thành công: {user_id}'})
    except Exception as e:
        logging.exception("Delete user error")
        return jsonify({'error': 'Lỗi xóa người dùng'}), 500
    
    
@app.route('/admin/summary', methods=['GET'])
def admin_summary():
    auth_result = check_authorization('admin')
    if auth_result:
        return auth_result

    try:
        users_table = dynamodb.Table('Users')
        attendance_table = dynamodb.Table('Attendance')

        # Đếm giáo viên
        teachers = users_table.scan(
            FilterExpression='#r = :r',
            ExpressionAttributeNames={'#r': 'role'},
            ExpressionAttributeValues={':r': 'teacher'}
        )['Items']

        # Đếm sinh viên
        students = users_table.scan(
            FilterExpression='#r = :r',
            ExpressionAttributeNames={'#r': 'role'},
            ExpressionAttributeValues={':r': 'student'}
        )['Items']

        # Lượt điểm danh hôm nay
        scan_result = attendance_table.scan()
        attendance_items = scan_result.get('Items', [])
        today = datetime.utcnow().date().isoformat()

        attendance_today = [
            item for item in attendance_items
            if item['timestamp'].startswith(today)
        ]

        recent = sorted(attendance_items, key=lambda x: x['timestamp'], reverse=True)[:5]

        return jsonify({
            'students': len(students),
            'teachers': len(teachers),
            'attendance_today': len(attendance_today),
            'recent': recent
        })
    except Exception as e:
        logging.exception("Admin summary error")
        return jsonify({'error': 'Lỗi lấy thông tin dashboard'}), 500


# ======================= CHẠY SERVER =======================
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)