import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Offcanvas, Button } from 'react-bootstrap';
import { FaSignOutAlt, FaUsers, FaHistory, FaUserPlus, FaCamera } from 'react-icons/fa';
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
            {/* Hamburger button for mobile */}
            {!show &&
                <Button
                    variant=""
                    onClick={handleShow}
                    className="d-lg-none"
                    style={{
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        zIndex: 1050,
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px',
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                    ☰
                </Button>
            }

            {/* Sidebar for desktop and Offcanvas for mobile */}
            <div
                className="d-none d-lg-block"
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
                }}
            >
                <div style={{ padding: '0 20px', marginBottom: '30px', textAlign: 'center' }}>
                    <h3 style={{ fontWeight: 'bold', color: 'white' }}>Dashboard</h3>
                </div>
                <Nav className="flex-column">
                    {user?.role === 'admin' && (
                        <>
                            <NavLink
                                to="/admin/manage-teachers"
                                className="nav-link"
                                style={({ isActive }) => ({
                                    color: 'white',
                                    padding: '15px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.3s ease',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                })}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                            >
                                <FaUsers className="me-2" /> Danh sách giáo viên
                            </NavLink>
                            <NavLink
                                to="/admin/manage-students"
                                className="nav-link"
                                style={({ isActive }) => ({
                                    color: 'white',
                                    padding: '15px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.3s ease',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                })}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                            >
                                <FaUsers className="me-2" /> Danh sách sinh viên
                            </NavLink>
                            <NavLink
                                to="/admin/history"
                                className="nav-link"
                                style={({ isActive }) => ({
                                    color: 'white',
                                    padding: '15px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.3s ease',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                })}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                            >
                                <FaHistory className="me-2" /> Lịch sử điểm danh
                            </NavLink>
                            <NavLink
                                to="/admin/register-admin"
                                className="nav-link"
                                style={({ isActive }) => ({
                                    color: 'white',
                                    padding: '15px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.3s ease',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                })}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                            >
                                <FaUserPlus className="me-2" /> Đăng ký (Admin)
                            </NavLink>
                        </>
                    )}
                    {user?.role === 'teacher' && (
                        <>
                            <NavLink
                                to="/teacher/history"
                                className="nav-link"
                                style={({ isActive }) => ({
                                    color: 'white',
                                    padding: '15px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.3s ease',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                })}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                            >
                                <FaHistory className="me-2" /> Lịch sử điểm danh
                            </NavLink>
                            <NavLink
                                to="/teacher/register-student"
                                className="nav-link"
                                style={({ isActive }) => ({
                                    color: 'white',
                                    padding: '15px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.3s ease',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                })}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                            >
                                <FaHistory className="me-2" /> Đăng ký (Sinh viên)
                            </NavLink>
                        </>
                    )}
                    {user?.role === 'student' && (
                        <>
                            <NavLink
                                to="/student/attendance"
                                className="nav-link"
                                style={({ isActive }) => ({
                                    color: 'white',
                                    padding: '15px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'background 0.3s ease',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                })}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                            >
                                <FaCamera className="me-2" /> Điểm danh
                            </NavLink>
                        </>
                    )}
                    {user &&
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
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                            <FaSignOutAlt className="me-2" /> Đăng xuất
                        </Nav.Link>
                    }
                </Nav>
            </div>

            {/* Offcanvas for mobile */}
            <Offcanvas show={show} onHide={handleClose} className="d-lg-none" style={{ width: '250px' }}>
                <Offcanvas.Header
                    closeButton
                    style={{
                        background: 'linear-gradient(45deg, #1e90ff, #6ab7f5)',
                        color: 'white',
                        padding: '20px',
                        textAlign: 'center'
                    }}
                >
                    <Offcanvas.Title style={{ fontWeight: 'bold', fontFamily: "'Poppins', sans-serif", marginLeft: '6vh', paddingTop: '.5vh' }}>
                        Dashboard
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body
                    style={{
                        background: 'linear-gradient(180deg, #1e90ff, #6ab7f5)',
                        color: 'white',
                        fontFamily: "'Poppins', sans-serif",
                    }}
                >
                    <Nav className="flex-column">
                        {user?.role === 'admin' && (
                            <>
                                <NavLink
                                    to="/admin/manage-teachers"
                                    className="nav-link"
                                    onClick={handleClose}
                                    style={({ isActive }) => ({
                                        color: 'white',
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'background 0.3s ease',
                                        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    })}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                    onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                                >
                                    <FaUsers className="me-2" /> Danh sách giáo viên
                                </NavLink>
                                <NavLink
                                    to="/admin/manage-students"
                                    className="nav-link"
                                    onClick={handleClose}
                                    style={({ isActive }) => ({
                                        color: 'white',
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'background 0.3s ease',
                                        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    })}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                    onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                                >
                                    <FaUsers className="me-2" /> Danh sách sinh viên
                                </NavLink>
                                <NavLink
                                    to="/admin/history"
                                    className="nav-link"
                                    onClick={handleClose}
                                    style={({ isActive }) => ({
                                        color: 'white',
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'background 0.3s ease',
                                        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    })}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                    onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                                >
                                    <FaHistory className="me-2" /> Lịch sử điểm danh
                                </NavLink>
                                <NavLink
                                    to="/admin/register-admin"
                                    className="nav-link"
                                    onClick={handleClose}
                                    style={({ isActive }) => ({
                                        color: 'white',
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'background 0.3s ease',
                                        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    })}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                    onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                                >
                                    <FaUserPlus className="me-2" /> Đăng ký (Admin)
                                </NavLink>
                            </>
                        )}
                        {user?.role === 'teacher' && (
                            <>
                                <NavLink
                                    to="/teacher/history"
                                    className="nav-link"
                                    onClick={handleClose}
                                    style={({ isActive }) => ({
                                        color: 'white',
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'background 0.3s ease',
                                        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    })}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                    onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                                >
                                    <FaHistory className="me-2" /> Đăng kí (Sinh viên)
                                </NavLink>
                                <NavLink
                                    to="/teacher/history"
                                    className="nav-link"
                                    onClick={handleClose}
                                    style={({ isActive }) => ({
                                        color: 'white',
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'background 0.3s ease',
                                        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    })}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                    onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                                >
                                    <FaHistory className="me-2" /> Lịch sử điểm danh
                                </NavLink>
                            </>
                        )}
                        {user?.role === 'student' && (
                            <>
                                <NavLink
                                    to="/student/attendance"
                                    className="nav-link"
                                    onClick={handleClose}
                                    style={({ isActive }) => ({
                                        color: 'white',
                                        padding: '15px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'background 0.3s ease',
                                        background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                    })}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                                    onMouseLeave={(e) => !e.currentTarget.classList.contains('active') && (e.currentTarget.style.background = 'transparent')}
                                >
                                    <FaCamera className="me-2" /> Điểm danh
                                </NavLink>
                            </>
                        )}
                        <Nav.Link
                            onClick={() => {
                                handleLogout();
                                handleClose();
                            }}
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
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                            <FaSignOutAlt className="me-2" /> Đăng xuất
                        </Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;