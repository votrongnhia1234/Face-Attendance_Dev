import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import Sidebar from '../common/Sidebar'; // Import Sidebar

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState({
    teacherId: '',
    name: '',
    classId: '',
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get('/users', { params: { role: 'teacher' } });
        setTeachers(response.data);
        setFilteredTeachers(response.data);
      } catch (error) {
        setError('Lỗi lấy danh sách giáo viên');
        toast.error('Lỗi lấy danh sách giáo viên');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    let filtered = [...teachers];

    if (search.teacherId) {
      filtered = filtered.filter(teacher =>
        teacher.user_id.toLowerCase().includes(search.teacherId.toLowerCase())
      );
    }
    if (search.name) {
      filtered = filtered.filter(teacher =>
        teacher.name && teacher.name.toLowerCase().includes(search.name.toLowerCase())
      );
    }
    if (search.classId) {
      filtered = filtered.filter(teacher =>
        teacher.class_id && teacher.class_id.toLowerCase().includes(search.classId.toLowerCase())
      );
    }

    setFilteredTeachers(filtered);
  }, [search, teachers]);

  const deleteTeacher = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa giáo viên này?')) {
      try {
        await axiosClient.delete(`/users/${id}`);
        setTeachers(teachers.filter((teacher) => teacher.user_id !== id));
        setFilteredTeachers(filteredTeachers.filter((teacher) => teacher.user_id !== id));
        toast.success('Xóa giáo viên thành công');
      } catch (error) {
        toast.error('Lỗi xóa giáo viên');
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div
        style={{
          marginLeft: '250px',
          width: 'calc(100% - 250px)',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
          padding: '20px',
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
            Danh sách giáo viên
          </h2>
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
              <span style={{ marginLeft: '10px', color: '#2c3e50' }}>Đang tải...</span>
            </div>
          )}
          <Form className="mb-4">
            <Row>
              <Col md={4} sm={12} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Mã Giáo Viên"
                  value={search.teacherId}
                  onChange={e => setSearch({ ...search, teacherId: e.target.value })}
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
              </Col>
              <Col md={4} sm={12} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Tên"
                  value={search.name}
                  onChange={e => setSearch({ ...search, name: e.target.value })}
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
              </Col>
              <Col md={4} sm={12} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Lớp"
                  value={search.classId}
                  onChange={e => setSearch({ ...search, classId: e.target.value })}
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
              </Col>
            </Row>
          </Form>
          {error && <Alert variant="danger" style={{ borderRadius: '10px' }}>{error}</Alert>}
          <Table
            striped
            bordered
            hover
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
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
                <th>Teacher ID</th>
                <th>Name</th>
                <th>Class ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher, index) => (
                  <tr
                    key={teacher.user_id}
                    style={{
                      animation: `slideIn 0.8s ease-in-out forwards`,
                      animationDelay: `${0.1 * (index + 1)}s`,
                      opacity: 0,
                      transition: 'background 0.3s ease, transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #e0e7ff, #f5f7fa)';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <td>{teacher.user_id}</td>
                    <td>{teacher.name || 'Không có tên'}</td>
                    <td>{teacher.class_id || 'Không có lớp'}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteTeacher(teacher.user_id)}
                        style={{
                          borderRadius: '15px',
                          padding: '5px 15px',
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center" style={{ padding: '20px' }}>
                    Không có giáo viên phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
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

export default ManageTeachers;