import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import AdminLogin from '../pages/AdminLogin';
import TeacherLogin from '../pages/TeacherLogin';
import StudentLogin from '../pages/StudentLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminHistoryPage from '../components/admin/HistoryPage';
import ManageTeachers from '../components/admin/ManageTeachers';
import ManageStudents from '../components/admin/ManageStudents';
import RegisterStudent from '../components/teacher/RegisterStudent';
import TeacherHistoryPage from '../components/teacher/HistoryPage';
import AttendancePage from '../components/student/AttendancePage';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';
import RegisterAdmin from '../pages/RegisterAdmin';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/history"
        element={
          <ProtectedRoute role="admin">
            <AdminHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-teachers"
        element={
          <ProtectedRoute role="admin">
            <ManageTeachers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-students"
        element={
          <ProtectedRoute role="admin">
            <ManageStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/register-admin"
        element={
          <ProtectedRoute role="admin">
            <RegisterAdmin />
          </ProtectedRoute>
        }
      />

      {/* Teacher routes */}
      <Route
        path="/teacher/register-student"
        element={
          <ProtectedRoute role="teacher">
            <RegisterStudent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/history"
        element={
          <ProtectedRoute role="teacher">
            <TeacherHistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Student routes */}
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute role="student">
            <AttendancePage />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;