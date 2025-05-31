import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { FaBook, FaChalkboardTeacher } from 'react-icons/fa';

const RegisterTeacher = () => {
  const [teacherId, setTeacherId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(
        '/admin/register-teacher',
        {
          teacher_id: teacherId,
          name,
          password,
          class_id: classId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setTeacherId('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      setClassId('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi đăng ký giáo viên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card
        className="animate-fadeInUp"
        style={{
          width: '400px',
          border: 'none',
          borderRadius: '18px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          animation: 'fadeIn 1s ease-in-out forwards',
          fontFamily: "'Poppins', sans-serif",
          padding: '20px',
        }}
      >
        <Card.Body>
          <h2
            className="animate-fadeInUp"
            style={{
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <FaBook style={{ color: '#1976d2', fontSize: '1.3rem' }} />
            Đăng ký Giáo viên
            <FaChalkboardTeacher style={{ color: '#fcb69f', fontSize: '1.1rem' }} />
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Teacher ID</Form.Label>
              <Form.Control
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  transition: 'border-color 0.3s ease',
                }}
                placeholder="Nhập mã giáo viên"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1e90ff')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#ced4da')}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Tên giáo viên</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  transition: 'border-color 0.3s ease',
                }}
                placeholder="Nhập tên giáo viên"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1e90ff')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#ced4da')}
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
                  transition: 'border-color 0.3s ease',
                }}
                placeholder="Nhập mật khẩu"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1e90ff')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#ced4da')}
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
                  transition: 'border-color 0.3s ease',
                }}
                placeholder="Nhập lại mật khẩu"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1e90ff')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#ced4da')}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Class ID (tùy chọn)</Form.Label>
              <Form.Control
                type="text"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  transition: 'border-color 0.3s ease',
                }}
                placeholder="Nhập mã lớp (nếu có)"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1e90ff')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#ced4da')}
              />
            </Form.Group>
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
              {loading ? 'Đang xử lý...' : 'Đăng ký giáo viên'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Container>
  );
};

export default RegisterTeacher;