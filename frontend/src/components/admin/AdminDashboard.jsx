import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Spinner,
  FormControl,
  InputGroup,
  Alert,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import { FaUsers, FaChalkboardTeacher, FaClipboardCheck, FaSearch, FaBook, FaGraduationCap } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, teachers: 0, attendance_today: 0 });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState({
    studentId: '',
    name: '',
    classId: '',
    date: '',
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get('/admin/summary');
      setStats({
        students: res.data.students,
        teachers: res.data.teachers,
        attendance_today: res.data.attendance_today,
      });
      const recent = res.data.recent || [];
      setRecentAttendance(recent);
      setFilteredRecords(recent);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu dashboard:', error);
      setError('Không thể tải dữ liệu thống kê');
      toast.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...recentAttendance];

    if (search.studentId) {
      filtered = filtered.filter(record =>
        record.student_id.toLowerCase().includes(search.studentId.toLowerCase())
      );
    }
    if (search.name) {
      filtered = filtered.filter(record =>
        record.name && record.name.toLowerCase().includes(search.name.toLowerCase())
      );
    }
    if (search.classId) {
      filtered = filtered.filter(record =>
        record.class_id && record.class_id.toLowerCase().includes(search.classId.toLowerCase())
      );
    }
    if (search.date) {
      const selectedDate = new Date(search.date).toISOString().split('T')[0];
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.timestamp).toISOString().split('T')[0];
        return recordDate === selectedDate;
      });
    }

    setFilteredRecords(filtered);
  }, [search, recentAttendance]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh',  }}>
      <Sidebar />
      <div
        style={{
          marginLeft: '250px',
          width: 'calc(100% - 250px)',
          padding: '15px',
        }}
        className="main-content"
      >
        <Container fluid className="py-3">
          <div style={{ textAlign: 'center', marginBottom: 10, fontSize: 18, color: '#1976d2', fontWeight: 500 }}>
            Xin chào, {user?.name || user?.id || 'Admin'}!
          </div>
          {loading && stats.students === 0 && stats.teachers === 0 && stats.attendance_today === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
              }}
            >
              <Spinner animation="border" role="status" variant="primary" />
              <p style={{ marginTop: '15px', fontSize: '1.2rem', color: '#333' }}>
                Đang tải dữ liệu...
              </p>
            </div>
          ) : (
            <>
              <h2
                className="animate-fadeInUp"
                style={{
                  color: '#2c3e50',
                  fontWeight: 'bold',
                  fontFamily: "'Poppins', sans-serif",
                  textAlign: 'center',
                  marginBottom: '20px',
                  fontSize: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <FaBook style={{ color: '#1976d2', fontSize: '1.5rem' }} />
                Admin Dashboard
                <FaGraduationCap style={{ color: '#fcb69f', fontSize: '1.3rem' }} />
              </h2>
              <Row className="mb-4">
                <Col md={4} sm={12}>
                  <Card
                    className="animate-fadeInUp"
                    style={{
                      border: 'none',
                      borderRadius: '18px',
                      background: 'linear-gradient(145deg, #a1c4fd 0%, #c2e9fb 100%)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      marginBottom: '15px',
                    }}
                  >
                    <Card.Body className="d-flex align-items-center">
                      <FaUsers style={{ fontSize: '2rem', color: '#1976d2', marginRight: '15px' }} />
                      <div>
                        <Card.Title style={{ fontFamily: "'Poppins', sans-serif", color: '#1976d2' }}>
                          Sinh viên
                        </Card.Title>
                        <Card.Text
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: '#1976d2',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {stats.students}
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} sm={12}>
                  <Card
                    className="animate-fadeInUp"
                    style={{
                      border: 'none',
                      borderRadius: '18px',
                      background: 'linear-gradient(145deg, #d4fc79 0%, #96e6a1 100%)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      marginBottom: '15px',
                    }}
                  >
                    <Card.Body className="d-flex align-items-center">
                      <FaChalkboardTeacher style={{ fontSize: '2rem', color: '#388e3c', marginRight: '15px' }} />
                      <div>
                        <Card.Title style={{ fontFamily: "'Poppins', sans-serif", color: '#388e3c' }}>
                          Giáo viên
                        </Card.Title>
                        <Card.Text
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: '#388e3c',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {stats.teachers}
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} sm={12}>
                  <Card
                    className="animate-fadeInUp"
                    style={{
                      border: 'none',
                      borderRadius: '18px',
                      background: 'linear-gradient(145deg, #ffecd2 0%, #fcb69f 100%)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      marginBottom: '15px',
                    }}
                  >
                    <Card.Body className="d-flex align-items-center">
                      <FaClipboardCheck style={{ fontSize: '2rem', color: '#f57c00', marginRight: '15px' }} />
                      <div>
                        <Card.Title style={{ fontFamily: "'Poppins', sans-serif", color: '#f57c00' }}>
                          Điểm danh hôm nay
                        </Card.Title>
                        <Card.Text
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: '#f57c00',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {stats.attendance_today}
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card
                className="animate-fadeInUp"
                style={{
                  maxWidth: '100%',
                  margin: 'auto',
                  marginTop: '20px',
                  border: 'none',
                  borderRadius: '18px',
                  background: 'white',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  padding: '15px',
                }}
              >
                {loading && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      borderRadius: '15px',
                    }}
                  >
                    <Spinner animation="border" variant="primary" />
                    <span style={{ marginLeft: '10px', fontFamily: "'Poppins', sans-serif" }}>
                      Đang tải...
                    </span>
                  </div>
                )}
                <Card.Body>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: '#2c3e50',
                        fontWeight: 'bold',
                      }}
                    >
                      Lịch Sử Điểm Danh
                    </h3>
                    <Button
                      variant="primary"
                      onClick={fetchSummary}
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(45deg, #6ab7f5, #1e90ff)',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '10px 20px',
                        fontSize: '14px',
                      }}
                    >
                      Làm Mới
                    </Button>
                  </div>
                  <Form style={{ marginBottom: '20px' }}>
                    <Row>
                      <Col md={3} sm={12} className="mb-3">
                        <InputGroup>
                          <FormControl
                            type="text"
                            placeholder="Mã Sinh Viên"
                            value={search.studentId}
                            onChange={e => setSearch({ ...search, studentId: e.target.value })}
                            style={{
                              borderRadius: '25px 0 0 25px',
                              border: '1px solid #ced4da',
                              padding: '10px',
                              fontSize: '14px',
                            }}
                          />
                          <InputGroup.Text
                            style={{
                              borderRadius: '0 25px 25px 0',
                              background: '#f5f7fa',
                              border: '1px solid #ced4da',
                              borderLeft: 'none',
                            }}
                          >
                            <FaSearch style={{ color: '#1e90ff' }} />
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>
                      <Col md={3} sm={12} className="mb-3">
                        <InputGroup>
                          <FormControl
                            type="text"
                            placeholder="Tên"
                            value={search.name}
                            onChange={e => setSearch({ ...search, name: e.target.value })}
                            style={{
                              borderRadius: '25px 0 0 25px',
                              border: '1px solid #ced4da',
                              padding: '10px',
                              fontSize: '14px',
                            }}
                          />
                          <InputGroup.Text
                            style={{
                              borderRadius: '0 25px 25px 0',
                              background: '#f5f7fa',
                              border: '1px solid #ced4da',
                              borderLeft: 'none',
                            }}
                          >
                            <FaSearch style={{ color: '#1e90ff' }} />
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>
                      <Col md={3} sm={12} className="mb-3">
                        <InputGroup>
                          <FormControl
                            type="text"
                            placeholder="Lớp"
                            value={search.classId}
                            onChange={e => setSearch({ ...search, classId: e.target.value })}
                            style={{
                              borderRadius: '25px 0 0 25px',
                              border: '1px solid #ced4da',
                              padding: '10px',
                              fontSize: '14px',
                            }}
                          />
                          <InputGroup.Text
                            style={{
                              borderRadius: '0 25px 25px 0',
                              background: '#f5f7fa',
                              border: '1px solid #ced4da',
                              borderLeft: 'none',
                            }}
                          >
                            <FaSearch style={{ color: '#1e90ff' }} />
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>
                      <Col md={3} sm={12} className="mb-3">
                        <Form.Control
                          type="date"
                          value={search.date}
                          onChange={e => setSearch({ ...search, date: e.target.value })}
                          style={{
                            borderRadius: '25px',
                            border: '1px solid #ced4da',
                            padding: '10px',
                            fontSize: '14px',
                          }}
                        />
                      </Col>
                    </Row>
                  </Form>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Table
                    className="animate-fadeInUp"
                    striped
                    bordered
                    hover
                    responsive
                    style={{
                      borderRadius: '10px',
                      overflow: 'hidden',
                      fontSize: '14px',
                    }}
                  >
                    <thead
                      style={{
                        background: 'linear-gradient(45deg, #1e90ff, #6ab7f5)',
                        color: 'white',
                        fontWeight: '600',
                      }}
                    >
                      <tr>
                        <th>Mã Sinh Viên</th>
                        <th>Tên</th>
                        <th>Lớp</th>
                        <th>Thời Gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.length > 0 ? (
                        filteredRecords.map((record, index) => (
                          <tr
                            key={index}
                            style={{
                              transition: 'background 0.3s ease',
                            }}
                          >
                            <td>{record.student_id}</td>
                            <td>{record.name || 'Không có tên'}</td>
                            <td>{record.class_id || 'Không có lớp'}</td>
                            <td>{new Date(record.timestamp).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            Không có bản ghi phù hợp
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}
        </Container>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 10px;
          }
          h2 {
            font-size: 18px !important;
            margin-bottom: 15px !important;
          }
          .col-sm-12 {
            margin-bottom: 10px !important;
          }
          [style*='animation'], [onMouseEnter], [onMouseLeave] {
            animation: none !important;
            pointer-events: none !important;
          }
          .card {
            margin-bottom: 10px !important;
          }
          td, th {
            font-size: 12px !important;
            padding: 6px !important;
          }
          button {
            font-size: 12px !important;
            padding: 8px 15px !important;
          }
        }
        @media (max-width: 576px) {
          .col-sm-12 {
            margin-bottom: 8px !important;
          }
          .card-body {
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;