import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Nav, Table } from "react-bootstrap";
import { BarChart, Book, BoxArrowRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server_url } from "../services/serverurl"; // Update this to your server URL file path

function InstructorDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const navigate = useNavigate();
  const[count,setcount]=useState(0);

  useEffect(() => {
    // Fetch courses and revenue data
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${server_url}/courses`);
       
       const fetchedCourses = response.data.filter(course => course.approvalStatus === 'Approved');
        
        setcount(fetchedCourses.length);
        
        // Calculate total revenue and students
        const revenue = fetchedCourses.reduce((sum, course) => sum + course.price, 0);
        const studentsCount = fetchedCourses.reduce((sum, course) => sum + course.students, 0);

        setCourses(fetchedCourses);
        setTotalRevenue(revenue);
        setTotalStudents(studentsCount);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    // Fetch students
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${server_url}/instructor/students`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchCourses();
    fetchStudents();
  }, []);

  const handleAddCourse = () => {
    navigate("/instructor/create-new-course");
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <aside className="bg-white shadow-sm p-4" style={{ width: "250px" }}>
        <h2 className="text-center mb-4">Instructor View</h2>
        <Nav className="flex-column">
          <Nav.Item>
            <Button
              variant="outline-primary"
              className="w-100 mb-2 d-flex align-items-center"
              onClick={() => setActiveView("dashboard")}
            >
              <BarChart className="me-2" />
              Dashboard
            </Button>
          </Nav.Item>
          <Nav.Item>
            <Button
              variant="outline-primary"
              className="w-100 mb-2 d-flex align-items-center"
              onClick={() => setActiveView("courses")}
            >
              <Book className="me-2" />
              Courses
            </Button>
          </Nav.Item>
          <Nav.Item>
            <Button
              onClick={handleLogout}
              variant="danger"
              className="w-100 mt-3 d-flex align-items-center"
            >
              <BoxArrowRight className="me-2" />
              Logout
            </Button>
          </Nav.Item>
        </Nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        <Container>
          {/* Dashboard View */}
          {activeView === "dashboard" && (
  <div>
    <h3 className="mb-4">Dashboard</h3>
    <Row className="mb-4">
      <Col md={6}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Total Revenue</h5>
            <p className="card-text display-6">₹{totalRevenue}</p>
          </div>
        </div>
      </Col>
      <Col md={6}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Total Courses</h5>
            <p className="card-text display-6">{count}</p>
          </div>
        </div>
      </Col>
    </Row>

    {/* Add Responsive Image */}
    <Row className="mb-4">
      <Col>
        <img 
          src="https://www.alphalearn.com/wp-content/uploads/2021/11/e-learning-2.jpg" 
          alt="Dashboard Illustration" 
          className="img-fluid shadow-sm" 
        />
      </Col>
    </Row>
  </div>
)}


          {/* Courses View */}
          {activeView === "courses" && (
            <div>
              <h3 className="mt-5 mb-4">Courses</h3>
              <Button
                variant="success"
                className="mb-4"
                onClick={handleAddCourse}
              >
                Add Course
              </Button>
              <Row>
                {courses.map((course) => (
                  <Col key={course.id} md={4}>
                    <div className="card mb-4 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        
                        <p className="card-text">Price: ₹{course.price}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

export default InstructorDashboard;
