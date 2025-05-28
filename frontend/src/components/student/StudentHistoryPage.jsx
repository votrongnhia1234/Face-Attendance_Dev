import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import Sidebar from '../common/Sidebar';
import { startOfDay, isSameDay } from 'date-fns';
import ResponsiveSearchForm from '../common/ResponsiveSearchForm';
import ResponsiveRecordList from '../common/ResponsiveRecordList';

const StudentHistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState({
    date: '',
  });

  const fetchHistory = async (key = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get('/history', {
        params: { limit: 20, last_key: key },
      });
      const newRecords = response.data.records;

      const uniqueRecords = newRecords.filter(newRec =>
        !records.some(prevRec =>
          prevRec.student_id === newRec.student_id &&
          prevRec.timestamp === newRec.timestamp &&
          prevRec.class_id === newRec.class_id
        )
      );

      if (!key) {
        setRecords(uniqueRecords);
      } else {
        setRecords(prev => [...prev, ...uniqueRecords]);
      }

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
    setRecords([]);
    setFilteredRecords([]);
    setLastKey(null);
    setHasMore(true);
    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = [];
    if (search.date) {
      const selectedDate = startOfDay(new Date(search.date));
      filtered = records.filter(record => {
        const recordDate = startOfDay(new Date(record.timestamp));
        return isSameDay(recordDate, selectedDate);
      });
    } else {
      filtered = [...records];
    }
    console.log('Records:', records.map(r => r.timestamp));
    console.log('Filtered Records:', filtered.map(r => r.timestamp));
    setFilteredRecords(filtered);
  }, [search, records]);

  const loadMore = () => {
    if (hasMore) fetchHistory(lastKey);
  };

  const emptyMessage = search.date
    ? `Không có bản ghi cho ngày ${new Date(search.date).toLocaleDateString('vi-VN')}`
    : 'Không có bản ghi nào';

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
          <h2
            style={{
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '22px',
            }}
          >
            Lịch sử điểm danh của tôi
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
          <ResponsiveSearchForm
            search={search}
            setSearch={setSearch}
            fields={['date']}
          />
          {error && <Alert variant="danger" style={{ borderRadius: '10px' }}>{error}</Alert>}
          <ResponsiveRecordList records={filteredRecords} emptyMessage={emptyMessage} />
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
        @media (max-width: 991px) {
          .main-content {
            margin-left: 0 !important;
            width: 100% !important;
            padding: 10px;
          }
        }
        @media (max-width: 576px) {
          .main-content {
            padding: 10px !important;
          }
          h2 {
            font-size: 18px !important;
            margin-bottom: 15px !important;
          }
          .mb-3 {
            margin-bottom: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentHistoryPage;