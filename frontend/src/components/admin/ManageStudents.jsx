import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import Sidebar from '../common/Sidebar';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState({
    studentId: '',
    name: '',
    classId: '',
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get('/users', { params: { role: 'student' } });
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        setError('Lỗi lấy danh sách sinh viên');
        toast.error('Lỗi lấy danh sách sinh viên');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = [...students];

    if (search.studentId) {
      filtered = filtered.filter(student =>
        student.user_id.toLowerCase().includes(search.studentId.toLowerCase())
      );
    }
    if (search.name) {
      filtered = filtered.filter(student =>
        student.name && student.name.toLowerCase().includes(search.name.toLowerCase())
      );
    }
    if (search.classId) {
      filtered = filtered.filter(student =>
        student.class_id && student.class_id.toLowerCase().includes(search.classId.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [search, students]);

  const deleteStudent = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sinh viên này?')) {
      try {
        await axiosClient.delete(`/users/${id}`);
        setStudents(students.filter((student) => student.user_id !== id));
        setFilteredStudents(filteredStudents.filter((student) => student.user_id !== id));
        toast.success('Xóa sinh viên thành công');
      } catch (error) {
        toast.error('Lỗi xóa sinh viên');
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
          padding: '15px',
        }}
        className="main-content"
      >
        <Card
          style={{
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            fontFamily: "'Poppins', sans-serif",
            padding: '15px',
          }}
        >
          <h2
            style={{
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            Danh sách sinh viên
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
                  placeholder="Mã Sinh Viên"
                  value={search.studentId}
                  onChange={e => setSearch({ ...search, studentId: e.target.value })}
                  style={{
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '14px',
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
                    fontSize: '14px',
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
                    fontSize: '14px',
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
                background: 'linear-gradient(45deg, #ffecd2, #fcb69f)',
                color: 'white',
                fontWeight: '600',
              }}
            >
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr
                    key={student.user_id}
                    style={{
                      transition: 'background 0.3s ease',
                    }}
                  >
                    <td>{student.user_id}</td>
                    <td>{student.name || 'Không có tên'}</td>
                    <td>{student.class_id || 'Không có lớp'}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteStudent(student.user_id)}
                        style={{
                          borderRadius: '15px',
                          padding: '8px 15px',
                          fontSize: '14px',
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center" style={{ padding: '20px' }}>
                    Không có sinh viên phù hợp
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
          [style*='animation'], [onMouseEnter], [onMouseLeave] {
            animation: none !important;
            pointer-events: none !important;
          }
          td, th {
            font-size: 14px !important;
            padding: 8px !important;
          }
          button {
            font-size: 14px !important;
            padding: 8px 15px !important;
          }
        }
        @media (max-width: 576px) {
          .col-sm-12 {
            margin-bottom: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageStudents;