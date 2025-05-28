import React, { useState } from 'react';
import { Container, Form, Button, Image, Card } from 'react-bootstrap';
import axiosClient from '../../api/axiosClient';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../common/Sidebar';

const RegisterStudent = () => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!image || !(image instanceof File)) {
      toast.error('Vui lòng chọn ảnh hợp lệ');
      return;
    }

    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('name', name);
    formData.append('class_id', classId);
    formData.append('password', password);
    formData.append('role', 'student');
    formData.append('image', image);

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('https://studentfacemanagements.onrender.com/register', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(response.data.message);
      // Reset form
      setStudentId('');
      setName('');
      setClassId('');
      setPassword('');
      setConfirmPassword('');
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error('Lỗi đăng ký:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'Lỗi đăng ký sinh viên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '60vh'}}>
      <Sidebar />
      <div
        style={{
          marginLeft: '500px',
          width: '100%',
          // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center'
        }}
        className="main-content"
      >
        <Card
          style={{
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            animation: 'fadeIn 1s ease-in-out forwards',
            fontFamily: "'Poppins', sans-serif",
            padding: '20px',
          }}
        >
          <h2
            style={{
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            Đăng ký Sinh viên
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Mã sinh viên</Form.Label>
              <Form.Control
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e90ff';
                  e.target.style.boxShadow = '0 0 8px rgba(30, 144, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ced4da';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Họ tên</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e90ff';
                  e.target.style.boxShadow = '0 0 8px rgba(30, 144, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ced4da';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Lớp</Form.Label>
              <Form.Control
                type="text"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e90ff';
                  e.target.style.boxShadow = '0 0 8px rgba(30, 144, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ced4da';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e90ff';
                  e.target.style.boxShadow = '0 0 8px rgba(30, 144, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ced4da';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e90ff';
                  e.target.style.boxShadow = '0 0 8px rgba(30, 144, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ced4da';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Ảnh khuôn mặt</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid #ced4da',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e90ff';
                  e.target.style.boxShadow = '0 0 8px rgba(30, 144, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ced4da';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </Form.Group>
            {preview && (
              <div className="mb-4 text-center">
                <Image src={preview} alt="preview" style={{ maxWidth: '300px', borderRadius: '10px' }} />
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(45deg, #1e90ff, #6ab7f5)',
                border: 'none',
                borderRadius: '25px',
                padding: '12px',
                fontWeight: '500',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
          </Form>
        </Card>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 991px) {
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterStudent;