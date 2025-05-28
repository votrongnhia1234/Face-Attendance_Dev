import React, { useState, useRef, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Card, Image, Spinner } from 'react-bootstrap';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Sidebar from '../common/Sidebar';

// Giả lập context (nếu bạn đã có context, thay thế bằng context thực tế)
const AttendanceContext = React.createContext();

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

  useEffect(() => {
    // Làm sạch preview khi image thay đổi
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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
          if (blob.size > 0) {
            setImage(blob);
            setPreview(imageSrc);
            stopWebcam();
          } else {
            setError('Ảnh chụp từ webcam trống.');
          }
        })
        .catch(() => setError('Lỗi khi chụp ảnh từ webcam'));
    } else {
      setError('Không thể chụp ảnh. Kiểm tra webcam.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 0 && file.type.startsWith('image/')) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      } else {
        setError('File không phải là ảnh hợp lệ.');
      }
    } else {
      setPreview(null);
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setAttendanceData(null);

    if (!image || image.size === 0) {
      setError('Vui lòng chọn ảnh hợp lệ hoặc chụp ảnh từ webcam');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }
      const apiUrl = process.env.REACT_APP_API_URL
      const response = await axios.post('https://studentfacemanagements.onrender.com/attendance', formData, {
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
      // Gửi sự kiện cập nhật qua context (nếu có)
      // Ví dụ: dispatchEvent(new CustomEvent('attendanceUpdated', { detail: response.data }));
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Điểm danh thất bại. Vui lòng thử lại.';
      setError(errorMsg.includes('lưu') ? 'Lỗi lưu thông tin điểm danh' : errorMsg);
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
          width: 'calc(100% - 250px)',
          padding: '15px',
        }}
        className="main-content"
      >
        <Card
          style={{
            maxWidth: '50%',
            margin: '0 auto',
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            fontFamily: "'Poppins', sans-serif",
            padding: '15px',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3
              style={{
                color: '#2c3e50',
                fontWeight: 'bold',
                marginBottom: '0',
                fontSize: '20px',
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
              onClose={() => setMessage('')}
              dismissible
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
              onClose={() => setError('')}
              dismissible
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
                  fontSize: '14px',
                }}
              />
            </Form.Group>

            {preview && (
              <Image
                src={preview}
                thumbnail
                className="mb-3 preview-image d-block mx-auto"
                style={{ maxWidth: '250px', borderRadius: '10px' }}
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
                fontSize: '14px',
              }}
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
                  style={{ borderRadius: '10px', overflow: 'hidden', maxWidth: '100%' }}
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
                      fontSize: '14px',
                    }}
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
                      fontSize: '14px',
                    }}
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
                fontSize: '14px',
              }}
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
                <Card.Title style={{ color: '#2c3e50', fontWeight: 'bold', fontSize: '16px' }}>
                  Thông Tin Điểm Danh
                </Card.Title>
                <Card.Text style={{ fontSize: '14px' }}>
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
            padding: 10px;
          }
          .card {
            max-width: 100% !important;
          }
        }
        @media (max-width: 576px) {
          .preview-image {
            max-width: 200px !important;
          }
          .card-body {
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AttendancePage;