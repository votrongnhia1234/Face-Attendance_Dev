import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post('/admin/login', {
        admin_id: adminId,
        password,
      });

      console.log('Login response:', response.data);

      if (!response.data.token) {
        toast.error('Token không hợp lệ');
        return;
      }

      login(response.data.token, 'admin');
      toast.success('Đăng nhập thành công');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="mt-5 d-flex justify-content-center"
      style={{ 
        minHeight: '80vh' 
        }}
    >
      <Card
        style={{
          width: '400px',
          border: 'none',
          borderRadius: '15px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          animation: 'fadeIn 1s ease-in-out forwards',
          fontFamily: "'Poppins', sans-serif",
          padding: '20px',
        }}

        
      >
        <Card.Body>
          <h2
            style={{
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            Admin Login
          </h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Admin ID</Form.Label>
              <Form.Control
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
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

export default AdminLogin;