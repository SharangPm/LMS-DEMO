import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Button, Nav, Card,
  Accordion, ProgressBar, Badge
} from "react-bootstrap";
import {
  BarChart, Book, BoxArrowRight, Cash, People,
  FileEarmarkText
} from "react-bootstrap-icons";
import {
  FaUserGraduate, FaVideo, FaChartLine,
  FaChevronDown, FaBook
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { server_url } from "../services/serverurl";
import Chat from "./Chat";

const progressStyles = {
  studentCard: {
    borderRadius: "15px",
    border: "none",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    overflow: "hidden"
  },
  progressBar: {
    height: "10px",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)"
  },
  courseCard: {
    background: "rgba(245, 247, 250, 0.5)",
    borderRadius: "12px",
    border: "1px solid rgba(0,0,0,0.05)"
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

function InstructorDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [count, setCount] = useState(0);
  const [studentsWithProgress, setStudentsWithProgress] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${server_url}/courses`);
        const fetchedCourses = response.data.filter(
          (course) => course.approvalStatus === "Approved"
        );
        setCount(fetchedCourses.length);
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchRevenue = async () => {
      try {
        const response = await axios.get(`${server_url}/revenue`);
        setTotalRevenue(response.data.totalRevenue);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    };

    const fetchStudentsWithProgress = async () => {
      try {
        const response = await axios.get(`${server_url}/students-with-progress`);
        setStudentsWithProgress(response.data);
      } catch (error) {
        console.error("Error fetching students with progress:", error);
      }
    };

    fetchCourses();
    fetchRevenue();
    fetchStudentsWithProgress();
  }, []);

  const handleAddCourse = () => navigate("/instructor/create-new-course");
  const handleLogout = () => navigate("/");

  return (
    <div className="d-flex min-vh-100" style={{ background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)" }}>
      {/* Sidebar */}
      <aside className="bg-white shadow-sm p-4" style={{ width: "250px", minHeight: "100vh", borderRight: "1px solid #e0e0e0" }}>
        <h2 className="text-center mb-4" style={{ color: "#2c3e50", fontWeight: "700", fontSize: "1.5rem" }}>
          Instructor View
        </h2>
        <Nav className="flex-column">
          <Nav.Item>
            <Button
              variant="outline-primary"
              className="w-100 mb-2 d-flex align-items-center justify-content-start"
              onClick={() => setActiveView("dashboard")}
              style={navButtonStyle}
            >
              <BarChart className="me-2" />
              Dashboard
            </Button>
          </Nav.Item>
          <Nav.Item>
            <Button
              variant="outline-primary"
              className="w-100 mb-2 d-flex align-items-center justify-content-start"
              onClick={() => setActiveView("courses")}
              style={navButtonStyle}
            >
              <Book className="me-2" />
              Courses
            </Button>
          </Nav.Item>
          <Nav.Item>
            <Button
              variant="outline-primary"
              className="w-100 mb-2 d-flex align-items-center justify-content-start"
              onClick={() => setActiveView("students")}
              style={navButtonStyle}
            >
              <People className="me-2" />
              Students
            </Button>
          </Nav.Item>
          <Nav.Item>
            <Button
              onClick={handleLogout}
              variant="danger"
              className="w-100 mt-3 d-flex align-items-center justify-content-start"
              style={logoutButtonStyle}
            >
              <BoxArrowRight className="me-2" />
              Logout
            </Button>
          </Nav.Item>
        </Nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4" style={{ overflowY: "auto", maxHeight: "100vh" }}>
        <Container>
          {/* Dashboard View */}
          {activeView === "dashboard" && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <h3 className="mb-4" style={sectionTitleStyle}>Dashboard</h3>
              <Row className="mb-4">
                <Col md={6} className="mb-4">
                  <Card style={dashboardCardStyle("#6a11cb", "#2575fc")}>
                    <Card.Body className="d-flex align-items-center">
                      <Cash size={40} className="me-3 text-white" />
                      <div>
                        <h5 className="card-title mb-1 text-white">Total Revenue</h5>
                        <p className="card-text display-6 text-white">₹{totalRevenue}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-4">
                  <Card style={dashboardCardStyle("#ff9a9e", "#fad0c4")}>
                    <Card.Body className="d-flex align-items-center">
                      <FileEarmarkText size={40} className="me-3 text-white" />
                      <div>
                        <h5 className="card-title mb-1 text-white">Total Courses</h5>
                        <p className="card-text display-6 text-white">{count}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  <img
                    src="https://www.alphalearn.com/wp-content/uploads/2021/11/e-learning-2.jpg"
                    alt="Dashboard Illustration"
                    className="img-fluid shadow-sm rounded"
                    style={{ borderRadius: "15px", width: "100%" }}
                  />
                </Col>
              </Row>
            </motion.div>
          )}

          {/* Courses View */}
          {activeView === "courses" && (
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <h3 className="mt-5 mb-4" style={sectionTitleStyle}>Courses</h3>
              <Button
                variant="success"
                className="mb-4"
                onClick={handleAddCourse}
                style={addCourseButtonStyle}
              >
                Add Course
              </Button>
              <Row>
                {courses.map((course) => (
                  <Col key={course._id} md={4}>
                    <CourseCard course={course} />
                  </Col>
                ))}
              </Row>
            </motion.div>
          )}

 {/* Students Progress View */}
{activeView === "students" && (
  <motion.div initial="hidden" animate="visible" variants={fadeIn} className="px-2 px-md-4">
    <h3 className="mt-3 mb-4 display-5 fw-bold text-primary text-center text-md-start">
      <FaChartLine className="me-3" />
      Student Learning Journeys
    </h3>

    <Accordion defaultActiveKey="0">
      {studentsWithProgress.map((student, idx) => (
        <motion.div
          key={student._id}
          whileHover={{ scale: 1.02 }}
          className="mb-3"
        >
          <Accordion.Item eventKey={idx.toString()} style={progressStyles.studentCard}>
            <Accordion.Header>
              <div className="d-flex w-100 align-items-center pe-2 pe-md-3">
                <div className="flex-grow-1">
                  <h5 className="mb-0 d-flex flex-column flex-md-row align-items-start align-items-md-center">
                    <span className="d-flex align-items-center me-md-3">
                      <FaUserGraduate className="me-2 text-primary" />
                      <span className="text-truncate" style={{ maxWidth: '200px' }}>
                        {student.username}
                      </span>
                    </span>
                    <Badge bg="info" className="mt-1 mt-md-0 ms-md-2">
                      {student.progress.length} Courses
                    </Badge>
                  </h5>
                  <small className="text-muted text-truncate d-block">{student.email}</small>
                </div>
                <FaChevronDown className="text-primary ms-2 ms-md-0 flex-shrink-0" />
              </div>
            </Accordion.Header>

            <Accordion.Body>
              <Row className="g-3">
                {student.progress.map((courseProg, cIdx) => {
                  const totalVideos = courseProg.courseId?.numberOfLectures || 0;
                  const completedVideos = courseProg.completedVideos?.length || 0;
                  const progressPercentage = totalVideos > 0
                    ? Math.round((completedVideos / totalVideos) * 100)
                    : 0;

                  return (
                    <Col xs={12} md={6} key={cIdx}>
                      <Card style={progressStyles.courseCard} className="h-100">
                        <Card.Body className="d-flex flex-column">
                          {/* Course Header */}
                          <div className="d-flex align-items-center mb-3">
                            <FaBook className="me-3 fs-5 text-primary flex-shrink-0" />
                            <div className="w-100">
                              <h6 className="mb-0" style={{ wordBreak: "break-word" }}>
                                {courseProg.courseId.title}
                              </h6>
                              <small className="text-muted">
                                {completedVideos} Videos Completed
                              </small>
                            </div>
                          </div>

                          {/* Progress Section */}
                          <div className="mt-auto">
                            <div className="d-flex flex-column flex-sm-row align-items-start gap-2">
                              <div className="d-flex align-items-center w-100">
                                <FaVideo className="me-3 text-secondary flex-shrink-0" />
                                <div className="w-100">
                                  <ProgressBar
                                    now={progressPercentage}
                                    label={`${progressPercentage}%`}
                                    style={{ 
                                      ...progressStyles.progressBar,
                                      height: "1.25rem"
                                    }}
                                    className="mb-2"
                                  />
                                  <div className="d-flex justify-content-between flex-wrap gap-2 small">
                                    <span>Completed</span>
                                    <span className="text-nowrap">
                                      {completedVideos}/{totalVideos} Videos
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </motion.div>
      ))}
    </Accordion>

    {studentsWithProgress.length === 0 && (
      <div className="text-center py-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
          alt="No progress"
          style={{ width: "150px", opacity: 0.5 }}
          className="mb-4 img-fluid"
        />
        <h4 className="text-muted h5 h4-md">No learning progress to display yet</h4>
        <p className="text-muted mt-2 mb-0 mx-auto" style={{ maxWidth: '500px' }}>
          Student progress will appear here as they engage with courses
        </p>
      </div>
    )}
  </motion.div>
)}
        </Container>
      </main>
      <Chat senderType="admin" />
    </div>
  );
}

// Styled components
const navButtonStyle = {
  borderRadius: "10px",
  padding: "10px",
  fontWeight: "600",
  border: "1px solid #2c3e50",
  color: "#2c3e50",
  transition: "all 0.3s ease",
};

const logoutButtonStyle = {
  borderRadius: "10px",
  padding: "10px",
  fontWeight: "600",
  transition: "all 0.3s ease",
};

const sectionTitleStyle = {
  color: "#2c3e50",
  fontWeight: "700",
  fontSize: "2rem",
};

const dashboardCardStyle = (startColor, endColor) => ({
  borderRadius: "15px",
  border: "none",
  background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
  color: "#fff",
});

const addCourseButtonStyle = {
  borderRadius: "10px",
  padding: "10px 20px",
  fontWeight: "600",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

// Course Card Component
const CourseCard = ({ course }) => (
  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
    <Card className="mb-4 shadow-sm" style={courseCardStyle}>
      <Card.Img
        variant="top"
        src={`${server_url}/${course.image}`}
        alt={course.title}
        style={courseImageStyle}
      />
      <Card.Body>
        <h5 style={courseTitleStyle}>{course.title}</h5>
        <p style={courseTextStyle}><strong>Instructor:</strong> {course.instructorName}</p>
        <p style={courseTextStyle}><strong>Price:</strong> ₹{course.price}</p>
        <p style={courseStatusStyle(course)}>
          <strong>Status:</strong> {course.approvalStatus}
        </p>
      </Card.Body>
    </Card>
  </motion.div>
);

const courseCardStyle = {
  borderRadius: "15px",
  border: "none",
  transition: "transform 0.3s ease",
};

const courseImageStyle = {
  borderTopLeftRadius: "15px",
  borderTopRightRadius: "15px",
  height: "200px",
  objectFit: "cover",
};

const courseTitleStyle = {
  color: "#2c3e50",
  fontWeight: "700",
  marginBottom: "0.5rem",
};

const courseTextStyle = {
  color: "#6c757d",
  marginBottom: "0.5rem",
};

const courseStatusStyle = (course) => ({
  marginBottom: "0",
  color: course.approvalStatus === "Approved"
    ? "green"
    : course.approvalStatus === "Pending"
      ? "orange"
      : "red",
  fontWeight: "600",
});

export default InstructorDashboard;