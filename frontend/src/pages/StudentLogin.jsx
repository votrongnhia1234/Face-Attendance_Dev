import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { FaBook, FaGraduationCap } from 'react-icons/fa';

const StudentLogin = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post('/student/login', {
        student_id: studentId,
        password,
      });
      login(response.data.token, 'student');
      toast.success('Đăng nhập thành công');
      navigate('/student/attendance'); // Thay đổi điều hướng sang Dashboard
    } catch (error) {
      toast.error(error.response?.data?.error || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="mt-5 d-flex justify-content-center"
      style={{ 
        // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', 
        minHeight: '80vh' 
      }}
    >
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
            Student Login
            <FaGraduationCap style={{ color: '#fcb69f', fontSize: '1.1rem' }} />
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Student ID</Form.Label>
              <Form.Control
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  padding: '12px',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1e90ff')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#ced4da')}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Password</Form.Label>
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
                onFocus={(e) => (e.currentTarget.style.borderColor = '#1e90ff')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#ced4da')}
              />
            </Form.Group>
            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(45deg, #ffecd2, #fcb69f)',
                border: 'none',
                borderRadius: '25px',
                padding: '12px',
                fontWeight: '500',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {loading ? 'Đang đăng nhập...' : 'Login'}
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

export default StudentLogin;