import React, { useState, useEffect } from 'react';
import { Button, Spinner, Alert, Card } from 'react-bootstrap';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { startOfDay, isSameDay } from 'date-fns';
import Sidebar from '../common/Sidebar';
import ResponsiveSearchForm from '../common/ResponsiveSearchForm';
import ResponsiveRecordList from '../common/ResponsiveRecordList';
import { useNavigate } from 'react-router-dom';

const TeacherHistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user?.class_id) {
      setRecords([]);
      setFilteredRecords([]);
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
      const selectedDate = startOfDay(new Date(search.date));
      filtered = filtered.filter(record => {
        const recordDate = startOfDay(new Date(record.timestamp));
        return isSameDay(recordDate, selectedDate);
      });
    }

    setFilteredRecords(filtered);
  }, [search, records]);

  const loadMore = () => {
    if (hasMore) fetchHistory(lastKey);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
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
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            fontFamily: "'Poppins', sans-serif",
            padding: '15px',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2
              style={{
                color: '#2c3e50',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '0',
                fontSize: '22px',
                textAlign: 'center',
              }}
            >
              Lịch sử điểm danh (Teacher)
            </h2>
            {/* <Button
              variant="primary"
              style={{ borderRadius: '25px', padding: '8px 20px', fontWeight: 500 }}
              onClick={() => navigate('/admin/dashboard')}
            >
              Quay về Dashboard
            </Button> */}
          </div>
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
          <ResponsiveSearchForm
            search={search}
            setSearch={setSearch}
            fields={['studentId', 'name', 'classId', 'date']}
          />
          {error && <Alert variant="danger" style={{ borderRadius: '10px' }}>{error}</Alert>}
          <ResponsiveRecordList records={filteredRecords} />
          {hasMore && (
            <Button
              onClick={loadMore}
              variant="primary"
              disabled={loading}
              style={{
                background: 'linear-gradient(45deg, #d4fc79, #96e6a1)',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 30px',
                marginTop: '20px',
                marginBottom: '20px',
                fontSize: '16px',
                minWidth: '150px',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
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
        @media (max-width: 991px) {
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 10px;
          }
        }
        @media (max-width: 768px) {
          .main-content {
            padding: 10px !important;
          }
          h2 {
            font-size: 18px !important;
            margin-bottom: 15px !important;
          }
          [style*='animation'] {
            animation: none !important;
          }
        }
        @media (max-width: 576px) {
          button {
            font-size: 14px !important;
            padding: 10px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherHistoryPage;