import boto3
from werkzeug.security import generate_password_hash

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('Users')

table.put_item(Item={
    'user_id': 'admin001',
    'name': 'Admin Test',
    'role': 'admin',
    'password': generate_password_hash('admin123')
})