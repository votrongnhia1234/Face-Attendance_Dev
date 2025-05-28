import React from 'react';
import { Table, Card, Row, Col } from 'react-bootstrap';

const ResponsiveRecordList = ({ records, emptyMessage }) => {
  return (
    <>
      <div className="d-none d-md-block">
        <Table striped bordered hover style={{ borderRadius: '10px', overflow: 'hidden' }}>
          <thead style={{ background: 'linear-gradient(45deg, #d4fc79, #96e6a1)', color: 'white', fontWeight: '600' }}>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Class ID</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record, index) => (
                <tr key={record.student_id + record.timestamp}>
                  <td>{record.student_id}</td>
                  <td>{record.name || 'Không có tên'}</td>
                  <td>{record.class_id || 'Không có lớp'}</td>
                  <td>{new Date(record.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center" style={{ padding: '20px' }}>
                  {emptyMessage || 'Không có bản ghi phù hợp'}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div className="d-block d-md-none">
        {records.length > 0 ? (
          records.map((record, index) => (
            <Card
              key={record.student_id + record.timestamp}
              style={{ marginBottom: '15px', borderRadius: '10px', padding: '15px' }}
            >
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <div><strong>Student ID:</strong> {record.student_id}</div>
                <div><strong>Name:</strong> {record.name || 'Không có tên'}</div>
                <div><strong>Class ID:</strong> {record.class_id || 'Không có lớp'}</div>
                <div><strong>Timestamp:</strong> {new Date(record.timestamp).toLocaleString()}</div>
              </div>
            </Card>
          ))
        ) : (
          <p style={{ textAlign: 'center', padding: '20px', fontSize: '14px' }}>
            {emptyMessage || 'Không có bản ghi phù hợp'}
          </p>
        )}
      </div>
    </>
  );
};

export default ResponsiveRecordList;