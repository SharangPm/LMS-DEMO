import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Authentication from './Pages/Authentication'
import Home from './Pages/Home'
import Courses from './Pages/Courses'
import MyCourses from './Pages/MyCourses'
import SelectedCourse from './Pages/SelectedCourse'
import SelectedSection from './Pages/SelectedSection'
import InstructorDashboard from './Pages/InstructorDashboard'
import CreateNewCourse from './Pages/CreateNewCourse'
import AdminPage from './Pages/AdminPage'
import ViewCorse from './Pages/ViewCorse'

const ProtectedRoute = ({ children, role }) => {
  const userRole = sessionStorage.getItem('role');
  const token = sessionStorage.getItem('token');

  // For admin/instructor, check role only
  if (role === 'admin' || role === 'instructor') {
    if (userRole !== role) {
      return <Navigate to="/" replace />;
    }
  }
  // For users, check both token and role
  else {
    if (!token || userRole !== 'user') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/courses' element={<Courses/>} />
        <Route path='/courses/:id' element={<SelectedCourse/>} />
        <Route path='/selected:id' element={<SelectedSection/>} />
        <Route path='/student-courses' element={<MyCourses/>} />
        <Route path='/view/:id' element={<ViewCorse/>} />
        
        {/* Protected Instructor Routes */}
        <Route path='/instructor' element={
          <ProtectedRoute role='instructor'>
            <InstructorDashboard/>
          </ProtectedRoute>
        } />
        <Route path='/instructor/create-new-course' element={
          <ProtectedRoute role='instructor'>
            <CreateNewCourse/>
          </ProtectedRoute>
        } />

        {/* Protected Admin Route */}
        <Route path='/admin' element={
          <ProtectedRoute role='admin'>
            <AdminPage/>
          </ProtectedRoute>
        } />

        <Route path='/register' element={<Authentication/>}/>
        <Route path='/*' element={<Navigate to={'/'}/>}/>
      </Routes>
    </>
  )
}

export default App