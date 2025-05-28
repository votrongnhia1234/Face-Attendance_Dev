import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Offcanvas, Button } from 'react-bootstrap';
import { FaSignOutAlt, FaUsers, FaHistory, FaUserPlus, FaCamera, FaBook, FaGraduationCap, FaUser } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {!show && (
        <Button
          variant=""
          onClick={handleShow}
          className="d-lg-none"
          style={{
            position: 'fixed',
            top: '15px',
            left: '15px',
            zIndex: 1050,
            backgroundColor: '#1e90ff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px', // Tăng kích thước
            height: '48px',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ☰
        </Button>
      )}

      <div
        className="d-none d-lg-block animate-fadeInUp"
        style={{
          width: '250px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'linear-gradient(180deg, #1e90ff, #6ab7f5)',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          fontFamily: "'Poppins', sans-serif",
          color: 'white',
          paddingTop: '20px',
          borderRadius: '0 18px 18px 0',
        }}
      >
        <div style={{ padding: '0 20px', marginBottom: '30px', textAlign: 'center' }}>
          <h3 style={{ fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaBook style={{ marginRight: '8px', color: '#ffe082' }} />
            <NavLink to="/admin/dashboard" style={{ textDecoration: 'none', color: 'white', }}>
              Dashboard
            </NavLink>
            <FaGraduationCap style={{ marginLeft: '8px', color: '#fff9c4' }} />
          </h3>
        </div>
        {user && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '2px solid #ffe082' }} />
            ) : (
              <FaUser style={{ fontSize: '2.2rem', color: '#ffe082', marginBottom: 8 }} />
            )}
            <div style={{ fontWeight: 600, color: '#fff', fontSize: 16 }}>{user.name || user.id || 'User'}</div>
            <div style={{ fontSize: 13, color: '#ffe082', fontWeight: 400 }}>
              {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Giáo viên' : 'Sinh viên'}
            </div>
          </div>
        )}
        <Nav className="flex-column">
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin/manage-teachers" className="nav-link" style={({ isActive }) => ({
                color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              })}>
                <FaUsers className="me-2" /> Danh sách giáo viên
              </NavLink>
              <NavLink to="/admin/manage-students" className="nav-link" style={({ isActive }) => ({
                color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              })}>
                <FaUsers className="me-2" /> Danh sách sinh viên
              </NavLink>
              <NavLink to="/admin/history" className="nav-link" style={({ isActive }) => ({
                color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              })}>
                <FaHistory className="me-2" /> Lịch sử điểm danh
              </NavLink>
              <NavLink to="/admin/register-admin" className="nav-link" style={({ isActive }) => ({
                color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              })}>
                <FaUserPlus className="me-2" /> Đăng ký (Admin)
              </NavLink>
            </>
          )}
          {user?.role === 'teacher' && (
            <>
              <NavLink to="/teacher/register-student" className="nav-link" style={({ isActive }) => ({
                color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              })}>
                <FaUserPlus className="me-2" /> Đăng ký (Sinh viên)
              </NavLink>
              <NavLink to="/teacher/history" className="nav-link" style={({ isActive }) => ({
                color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              })}>
                <FaHistory className="me-2" /> Lịch sử điểm danh
              </NavLink>
            </>
          )}
          {user?.role === 'student' && (
            <>
              <NavLink to="/student/attendance" className="nav-link" style={({ isActive }) => ({
                color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              })}>
                <FaCamera className="me-2" /> Điểm danh
              </NavLink>
              <NavLink to="/student/history" className="nav-link" style={({ isActive }) => ({
                color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
              })}>
                <FaHistory className="me-2" /> Lịch sử điểm danh
              </NavLink>
            </>
          )}
          {user && (
            <Nav.Link
              onClick={handleLogout}
              style={{
                color: 'white',
                padding: '15px 20px',
                display: 'flex',
                alignItems: 'center',
                transition: 'background 0.3s ease',
                position: 'absolute',
                bottom: '20px',
                width: '100%',
              }}
            >
              <FaSignOutAlt className="me-2" /> Đăng xuất
            </Nav.Link>
          )}
        </Nav>
      </div>

      <Offcanvas show={show} onHide={handleClose} className="d-lg-none" style={{ width: '250px' }}>
        <Offcanvas.Header
          closeButton
          style={{
            background: 'linear-gradient(45deg, #1e90ff, #6ab7f5)',
            color: 'white',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <Offcanvas.Title style={{ fontWeight: 'bold', fontFamily: "'Poppins', sans-serif", marginLeft: '6vh', paddingTop: '.5vh' }}>
            <NavLink to="/admin/dashboard" style={{ textDecoration: 'none', color: 'white', }}>
              Dashboard
            </NavLink>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{
            background: 'linear-gradient(180deg, #1e90ff, #6ab7f5)',
            color: 'white',
            fontFamily: "'Poppins', sans-serif",
            padding: '10px', // Giảm padding để tối ưu không gian
          }}
        >
          {user && (
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '2px solid #ffe082' }} />
              ) : (
                <FaUser style={{ fontSize: '2.2rem', color: '#ffe082', marginBottom: 8 }} />
              )}
              <div style={{ fontWeight: 600, color: '#fff', fontSize: 16 }}>{user.name || user.id || 'User'}</div>
              <div style={{ fontSize: 13, color: '#ffe082', fontWeight: 400 }}>
                {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Giáo viên' : 'Sinh viên'}
              </div>
            </div>
          )}
          <Nav className="flex-column">
            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin/manage-teachers" className="nav-link" onClick={handleClose} style={({ isActive }) => ({
                  color: 'white', padding: '20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                })}>
                  <FaUsers className="me-2" /> Danh sách giáo viên
                </NavLink>
                <NavLink to="/admin/manage-students" className="nav-link" onClick={handleClose} style={({ isActive }) => ({
                  color: 'white', padding: '20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                })}>
                  <FaUsers className="me-2" /> Danh sách sinh viên
                </NavLink>
                <NavLink to="/admin/history" className="nav-link" onClick={handleClose} style={({ isActive }) => ({
                  color: 'white', padding: '20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                })}>
                  <FaHistory className="me-2" /> Lịch sử điểm danh
                </NavLink>
                <NavLink to="/admin/register-admin" className="nav-link" onClick={handleClose} style={({ isActive }) => ({
                  color: 'white', padding: '20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                })}>
                  <FaUserPlus className="me-2" /> Đăng ký (Admin)
                </NavLink>
              </>
            )}
            {user?.role === 'teacher' && (
              <>
                <NavLink to="/teacher/register-student" className="nav-link" onClick={handleClose} style={({ isActive }) => ({
                  color: 'white', padding: '20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                })}>
                  <FaUserPlus className="me-2" /> Đăng ký (Sinh viên)
                </NavLink>
                <NavLink to="/teacher/history" className="nav-link" onClick={handleClose} style={({ isActive }) => ({
                  color: 'white', padding: '20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                })}>
                  <FaHistory className="me-2" /> Lịch sử điểm danh
                </NavLink>
              </>
            )}
            {user?.role === 'student' && (
              <>
                <NavLink to="/student/attendance" className="nav-link" onClick={handleClose} style={({ isActive }) => ({
                  color: 'white', padding: '20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                })}>
                  <FaCamera className="me-2" /> Điểm danh
                </NavLink>
                <NavLink to="/student/history" className="nav-link" onClick={handleClose} style={({ isActive }) => ({
                  color: 'white', padding: '20px', display: 'flex', alignItems: 'center', transition: 'background 0.3s ease', background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                })}>
                  <FaHistory className="me-2" /> Lịch sử điểm danh
                </NavLink>
              </>
            )}
            {user && (
              <Nav.Link
                onClick={() => {
                  handleLogout();
                  handleClose();
                }}
                style={{
                  color: 'white',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.3s ease',
                  position: 'absolute',
                  bottom: '20px',
                  width: '100%',
                }}
              >
                <FaSignOutAlt className="me-2" /> Đăng xuất
              </Nav.Link>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;