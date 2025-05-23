import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Spinner, Alert, Card, Image } from 'react-bootstrap';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Sidebar from '../common/Sidebar';

const TeacherHistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [qrExpiry, setQrExpiry] = useState(null);
  const { user } = useAuth();
  const [search, setSearch] = useState({
    studentId: '',
    name: '',
    classId: '',
    date: '',
  });

  const fetchHistory = async (key = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get('/history', {
        params: { class_id: user.class_id, limit: 20, last_key: key },
      });
      const newRecords = response.data.records;
      setRecords((prev) => [...prev, ...newRecords]);
      setFilteredRecords((prev) => [...prev, ...newRecords]);
      setLastKey(response.data.last_key);
      setHasMore(!!response.data.last_key);
    } catch (error) {
      setError(error.response?.data?.error || 'Lỗi lấy lịch sử điểm danh');
      toast.error(error.response?.data?.error || 'Lỗi lấy lịch sử điểm danh');
    } finally {
      setLoading(false);
    }
  };

  const generateQrCode = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.post('/teacher/generate-qr');
      setQrCode(response.data.qr_code);
      setQrExpiry(new Date(response.data.expiry).toLocaleString());
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi tạo mã QR');
    } finally {
      setLoading(false);
    }
  };

  const updateAttendanceStatus = async (studentId, timestamp, status) => {
    try {
      await axiosClient.put(`/attendance/${studentId}/${timestamp}`, { status });
      setRecords((prev) =>
        prev.map((record) =>
          record.student_id === studentId && record.timestamp === timestamp
            ? { ...record, status }
            : record
        )
      );
      setFilteredRecords((prev) =>
        prev.map((record) =>
          record.student_id === studentId && record.timestamp === timestamp
            ? { ...record, status }
            : record
        )
      );
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi cập nhật trạng thái');
    }
  };

  useEffect(() => {
    if (user?.class_id) {
      fetchHistory();
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...records];

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
  }, [search, records]);

  const loadMore = () => {
    if (hasMore) fetchHistory(lastKey);
  };


  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div
        style={{
          marginLeft: '250px',
          width: 'calc(100% - 250px)',
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
            Lịch sử điểm danh (Teacher)
          </h2>
          <Button
            onClick={generateQrCode}
            variant="primary"
            disabled={loading}
            style={{
              background: 'linear-gradient(45deg, #1e90ff, #6ab7f5)',
              border: 'none',
              borderRadius: '25px',
              padding: '10px 30px',
              marginBottom: '20px',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Tạo mã QR điểm danh
          </Button>
          {qrCode && (
            <div className="text-center mb-4">
              <Image src={qrCode} alt="QR Code" style={{ maxWidth: '200px' }} />
              <p>Hết hạn: {qrExpiry}</p>
            </div>
          )}
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
              <Col md={3} sm={12} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Mã Sinh Viên"
                  value={search.studentId}
                  onChange={e => setSearch({ ...search, studentId: e.target.value })}
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
              <Col md={3} sm={12} className="mb-3">
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
              <Col md={3} sm={12} className="mb-3">
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
              <Col md={3} sm={12} className="mb-3">
                <Form.Control
                  type="date"
                  value={search.date}
                  onChange={e => setSearch({ ...search, date: e.target.value })}
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
                background: 'linear-gradient(45deg, #d4fc79, #96e6a1)',
                color: 'white',
                fontWeight: '600',
              }}
            >
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class ID</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <tr
                    key={record.student_id + record.timestamp}
                    style={{
                      animation: `slideIn 0.8s ease-in-out forwards`,
                      animationDelay: `${0.01 * (index + 1)}s`,
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
                    <td>{record.student_id}</td>
                    <td>{record.name || 'Không có tên'}</td>
                    <td>{record.class_id || 'Không có lớp'}</td>
                    <td>{new Date(record.timestamp).toLocaleString()}</td>
                    <td>{record.status === 'present' ? 'Có mặt' : 'Vắng mặt'}</td>
                    <td>
                      <Button
                        variant={record.status === 'present' ? 'warning' : 'success'}
                        size="sm"
                        onClick={() =>
                          updateAttendanceStatus(
                            record.student_id,
                            record.timestamp,
                            record.status === 'present' ? 'absent' : 'present'
                          )
                        }
                        style={{
                          borderRadius: '15px',
                          padding: '5px 15px',
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {record.status === 'present' ? 'Đặt Vắng' : 'Đặt Có mặt'}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: '20px' }}>
                    Không có bản ghi phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {hasMore && (
            <Button
              onClick={loadMore}
              variant="primary"
              disabled={loading}
              style={{
                background: 'linear-gradient(45deg, #d4fc79, #96e6a1)',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 30px',
                marginTop: '20px',
                transition: 'transform 0.3s ease',
                animation: 'fadeIn 1s ease-in-out forwards',
                animationDelay: '0.4s',
                opacity: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Load More
            </Button>
          )}
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

export default TeacherHistoryPage;