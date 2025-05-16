import React, { useState, useRef } from 'react';
import { Container, Form, Button, Alert, Card, Image, Spinner } from 'react-bootstrap';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

const AttendancePage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const checkWebcamSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Trình duyệt không hỗ trợ webcam.');
      return false;
    }
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('Webcam chỉ hoạt động trên HTTPS hoặc localhost.');
      return false;
    }
    return true;
  };

  const startWebcam = () => {
    if (checkWebcamSupport()) setShowWebcam(true);
  };

  const stopWebcam = () => {
    setShowWebcam(false);
  };

  const captureImage = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          setImage(blob);
          setPreview(imageSrc);
          stopWebcam();
        })
        .catch(() => setError('Lỗi khi chụp ảnh từ webcam'));
    } else {
      setError('Không thể chụp ảnh. Kiểm tra webcam.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setAttendanceData(null);

    if (!image) {
      setError('Vui lòng chọn ảnh hoặc chụp ảnh từ webcam');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/attendance', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setAttendanceData({
        name: response.data.name,
        student_id: response.data.student_id,
        timestamp: new Date(response.data.timestamp).toLocaleString('vi-VN'),
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Điểm danh thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div
        style={{
          marginLeft: '250px',
          width: '80%',
          // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
          padding: '20px',
        }}
        className="main-content"
      >
        <Card
          style={{
            maxWidth: '50%',
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            animation: 'fadeIn 1s ease-in-out forwards',
            fontFamily: "'Poppins', sans-serif",
            padding: '20px',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3
              style={{
                color: '#2c3e50',
                fontWeight: 'bold',
                marginBottom: '0',
              }}
            >
              Điểm Danh Khuôn Mặt
            </h3>
          </div>

          {message && (
            <Alert
              variant="success"
              className="d-flex align-items-center"
              style={{ borderRadius: '10px' }}
            >
              <FaCheckCircle className="me-2" />
              {message}
            </Alert>
          )}
          {error && (
            <Alert
              variant="danger"
              className="d-flex align-items-center"
              style={{ borderRadius: '10px' }}
            >
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#2c3e50' }}>Chọn ảnh khuôn mặt</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
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
            </Form.Group>

            {preview && (
              <Image
                src={preview}
                thumbnail
                className="mb-3 preview-image d-block mx-auto"
                style={{ maxWidth: '300px', borderRadius: '10px' }}
              />
            )}

            <Button
              variant="primary"
              onClick={startWebcam}
              className="mb-3 w-100"
              disabled={loading}
              style={{
                background: 'linear-gradient(45deg, #1e90ff, #6ab7f5)',
                border: 'none',
                borderRadius: '25px',
                padding: '12px',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <FaCamera className="me-2" />
              Sử dụng Webcam
            </Button>

            {showWebcam && (
              <div className="mb-4">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
                  style={{ borderRadius: '10px', overflow: 'hidden' }}
                />
                <div className="mt-3 d-flex justify-content-between">
                  <Button
                    variant="success"
                    onClick={captureImage}
                    className="flex-grow-1 me-2"
                    style={{
                      background: 'linear-gradient(45deg, #d4fc79, #96e6a1)',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '12px',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    Chụp ảnh
                  </Button>
                  <Button
                    variant="danger"
                    onClick={stopWebcam}
                    className="flex-grow-1"
                    style={{
                      borderRadius: '25px',
                      padding: '12px',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <FaTimes className="me-2" />
                    Tắt Webcam
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="success"
              className="w-100"
              disabled={loading}
              style={{
                background: 'linear-gradient(45deg, #ffecd2, #fcb69f)',
                border: 'none',
                borderRadius: '25px',
                padding: '12px',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaCheckCircle className="me-2" />
                  Điểm Danh
                </>
              )}
            </Button>
          </Form>

          {attendanceData && (
            <Card
              className="mt-4"
              style={{
                background: '#f8f9fa',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              }}
            >
              <Card.Body>
                <Card.Title style={{ color: '#2c3e50', fontWeight: 'bold' }}>
                  Thông Tin Điểm Danh
                </Card.Title>
                <Card.Text>
                  <strong>Họ và tên:</strong> {attendanceData.name}<br />
                  <strong>Mã sinh viên:</strong> {attendanceData.student_id}<br />
                  <strong>Thời gian:</strong> {attendanceData.timestamp}
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </Card>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

export default AttendancePage;