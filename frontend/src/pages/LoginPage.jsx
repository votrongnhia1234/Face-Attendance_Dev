import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaGraduationCap } from 'react-icons/fa';

const LoginPage = () => {
  return (
    <div
      className="container-fluid d-flex justify-content-center"
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
        }}
      >
        <Card.Body className="p-4">
          <Card.Title
            className="animate-fadeInUp"
            style={{
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <FaBook style={{ color: '#1976d2', fontSize: '1.3rem' }} />
            Chọn vai trò
            <FaGraduationCap style={{ color: '#fcb69f', fontSize: '1.1rem' }} />
          </Card.Title>
          <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px' }}>
            Chọn vai trò của bạn để đăng nhập.
          </p>
          <div className="d-flex flex-column align-items-center">
            <Button
              as={Link}
              to="/admin-login"
              variant="primary"
              className="me-2 mb-2"
              style={{
                width: '250px',
                background: 'linear-gradient(45deg, #1e90ff, #6ab7f5)',
                border: 'none',
                borderRadius: '25px',
                padding: '10px',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Admin Login
            </Button>
            <Button
              as={Link}
              to="/teacher-login"
              variant="secondary"
              className="mb-2"
              style={{
                width: '250px',
                background: 'linear-gradient(45deg, #d4fc79, #96e6a1)',
                border: 'none',
                borderRadius: '25px',
                padding: '10px',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Teacher Login
            </Button>
            <Button
              as={Link}
              to="/student-login"
              variant="success"
              style={{
                width: '250px',
                background: 'linear-gradient(45deg, #ffecd2, #fcb69f)',
                border: 'none',
                borderRadius: '25px',
                padding: '10px',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Student Login
            </Button>
          </div>
        </Card.Body>
      </Card>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;