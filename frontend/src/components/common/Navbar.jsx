import React from 'react';
import { Navbar, Nav, Container, NavbarText } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { FaUser, FaBook, FaGraduationCap } from 'react-icons/fa';

const NavigationBar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      toast.success('Đăng xuất thành công');
    }
  };

  return (
    <Navbar
      className="animate-fadeInUp"
      style={{
        background: 'linear-gradient(90deg, #1e90ff, #6ab7f5)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        borderRadius: '0 0 18px 18px',
        padding: '10px 20px',
        fontFamily: "'Poppins', sans-serif",
      }}
      expand="lg"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center animate-fadeInUp"
          style={{
            color: 'white',
            fontWeight: '600',
            fontSize: '1.5rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <FaBook style={{ marginRight: '10px', color: '#ffe082', fontSize: '1.6rem' }} />
          Hệ thống điểm danh
          <FaGraduationCap style={{ marginLeft: '10px', color: '#fff9c4', fontSize: '1.4rem' }} />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!user && (
              <Nav.Link
                as={Link}
                to="/login"
                style={{
                  color: 'white',
                  fontWeight: '500',
                  padding: '10px 20px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffeb3b';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Đăng nhập
              </Nav.Link>
            )}
            {user && user.role === 'admin' && (
              <>
                <Nav.Link
                  as={Link}
                  to="/admin/dashboard"
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffeb3b';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/admin/history"
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffeb3b';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Lịch sử điểm danh
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/admin/manage-teachers"
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffeb3b';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Danh sách giáo viên
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/admin/manage-students"
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffeb3b';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Danh sách sinh viên
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/admin/register-admin"
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffeb3b';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Đăng ký (Admin)
                </Nav.Link>
              </>
            )}
            {user && user.role === 'teacher' && (
              <>
                <Nav.Link
                  as={Link}
                  to="/teacher/register-student"
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffeb3b';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Đăng ký sinh viên
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/teacher/history"
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffeb3b';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Lịch sử điểm danh
                </Nav.Link>
              </>
            )}
            {user && user.role === 'student' && (
              <>
                <Nav.Link
                  as={Link}
                  to="/student/attendance"
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffeb3b';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Điểm danh
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/student/history" 
                  style={{
                    color: 'white',
                    fontWeight: '500',
                    padding: '10px 20px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffeb3b';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Lịch sử điểm danh
                </Nav.Link>
              </>
            )}
          </Nav>
          {user && (
            <Nav className="align-items-center">
              <NavbarText
                style={{
                  color: 'white',
                  fontWeight: '500',
                  fontFamily: "'Poppins', sans-serif",
                  padding: '5px 15px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.3s ease',
                  gap: '10px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 8 }} />
                ) : (
                  <FaUser style={{ fontSize: '1.2rem', marginRight: '8px', color: '#ffeb3b' }} />
                )}
                <span style={{ fontWeight: 600 }}>{user.name || user.id || 'User'}</span>
                <span style={{ fontSize: 13, color: '#ffe082', marginLeft: 6, fontWeight: 400 }}>
                  {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Giáo viên' : 'Sinh viên'}
                </span>
              </NavbarText>
              <Nav.Link
                onClick={handleLogout}
                style={{
                  color: 'white',
                  fontWeight: '500',
                  padding: '10px 20px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffeb3b';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Đăng xuất
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;