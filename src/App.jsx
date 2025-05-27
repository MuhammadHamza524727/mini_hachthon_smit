import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './Pages/Signup'
import UserDashboard from './Pages/UserDashboard'
import AdminDashboard from './Pages/AdminDashboard'
import UploadForm from './Pages/UplaodForm'
import ProtectedRoute from './Pages/ProtectedRoutes'
import Login from './Pages/Login'
import ApprovedEvents from './Pages/ApprovedEvents'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="approved-events" element={<ApprovedEvents />} />
        </Route>

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadForm />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
