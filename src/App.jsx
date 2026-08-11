import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Auth Pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard'
import CreateComplaint from './pages/student/CreateComplaint'
import StudentComplaints from './pages/student/StudentComplaints'
import ComplaintDetails from './pages/student/ComplaintDetails'

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffComplaints from './pages/staff/StaffComplaints'
import StaffComplaintDetails from './pages/staff/StaffComplaintDetails'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminDepartments from './pages/admin/AdminDepartments'
import AdminUsers from './pages/admin/AdminUsers'
import Analytics from './pages/admin/Analytics'

function App() {
  const { isAuthenticated, role } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated && role ? `/${role}/dashboard` : '/login'} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="complaints/create" element={<CreateComplaint />} />
        <Route path="complaints/:id" element={<ComplaintDetails />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="complaints" element={<StaffComplaints />} />
        <Route path="complaints/:id" element={<StaffComplaintDetails />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
