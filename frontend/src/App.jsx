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
        <Route path='/instructor' element={<InstructorDashboard/>} />
        <Route path='/admin' element={<AdminPage/>} />
        <Route path='/instructor/create-new-course' element={<CreateNewCourse/>} />
        <Route path='/register' element={<Authentication/>}/>
        <Route path='/*' element={<Navigate to={'/'}/>}/>
        
      </Routes>

    </>
  )
}

export default App
