import React from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaGraduationCap } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <Container
      className="mt-5 d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
    >
      <div
        style={{
          textAlign: 'center',
          animation: 'fadeIn 1s ease-in-out forwards',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Alert
          className="animate-fadeInUp"
          variant="danger"
          style={{
            borderRadius: '18px',
            padding: '30px',
            boxShadow: '0 8px 20px rgba(220,53,69,0.2)',
          }}
        >
          <h2 className="d-flex align-items-center justify-content-center gap-2" style={{ color: '#dc3545', fontWeight: 'bold' }}>
            <FaBook style={{ color: '#1976d2', fontSize: '1.3rem' }} />
            Unauthorized Access
            <FaGraduationCap style={{ color: '#fcb69f', fontSize: '1.1rem' }} />
          </h2>
          <p style={{ color: '#7f8c8d' }}>You do not have permission to access this page.</p>
        </Alert>
        <Button
          as={Link}
          to="/login"
          variant="primary"
          style={{
            background: 'linear-gradient(45deg, #1e90ff, #6ab7f5)',
            border: 'none',
            borderRadius: '25px',
            padding: '10px 30px',
            marginTop: '20px',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Go to Login
        </Button>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Container>
  );
};

export default Unauthorized;