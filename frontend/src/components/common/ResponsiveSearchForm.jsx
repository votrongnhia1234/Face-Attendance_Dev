import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ResponsiveSearchForm = ({ search, setSearch, fields = ['date'] }) => {
  return (
    <Form className="mb-4">
      <Row>
        {fields.includes('studentId') && (
          <Col xs={12} md={3} className="mb-3">
            <Form.Label>Mã Sinh Viên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập Mã Sinh Viên"
              value={search.studentId}
              onChange={e => setSearch({ ...search, studentId: e.target.value })}
              style={{ borderRadius: '10px', padding: '12px', fontSize: '16px' }}
            />
          </Col>
        )}
        {fields.includes('name') && (
          <Col xs={12} md={3} className="mb-3">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập Tên"
              value={search.name}
              onChange={e => setSearch({ ...search, name: e.target.value })}
              style={{ borderRadius: '10px', padding: '12px', fontSize: '16px' }}
            />
          </Col>
        )}
        {fields.includes('classId') && (
          <Col xs={12} md={3} className="mb-3">
            <Form.Label>Lớp</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập Lớp"
              value={search.classId}
              onChange={e => setSearch({ ...search, classId: e.target.value })}
              style={{ borderRadius: '10px', padding: '12px', fontSize: '16px' }}
            />
          </Col>
        )}
        {fields.includes('date') && (
          <Col xs={12} md={3} className="mb-3">
            <Form.Label>Chọn ngày</Form.Label>
            <Form.Control
              type="date"
              value={search.date}
              onChange={e => setSearch({ ...search, date: e.target.value })}
              style={{ borderRadius: '10px', padding: '12px', fontSize: '16px' }}
            />
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default ResponsiveSearchForm;