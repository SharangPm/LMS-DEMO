import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import Header from "../Components/Header";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import axios from "axios"; // Import axios
import { server_url } from "../services/serverurl";

function Home() {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    async function fetchCourses() {
      try {
        // Fetch courses from the backend and limit to 8
        const response = await axios.get(`${server_url}/selectedCourses`);
        
        const approvedCourses = response.data.filter(course => course.approvalStatus === 'Approved');
        setStudentViewCoursesList(approvedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, []);

  

  return (
    <>
      <Header Auth />
      <Container fluid className="bg-white min-vh-100">
        {/* Banner Section */}
        <Row
          className="align-items-center py-5 position-relative"
          style={{
            background: "linear-gradient(to right, #4facfe, #00f2fe)",
            position: "relative",
          }}
        >
          <Col
            lg={6}
            className="text-center text-lg-start"
            style={{ zIndex: 2, color: "white" }}
          >
            <h1
              className="display-4 fw-bold mb-3"
              style={{
                textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              }}
            >
              Start Learning
            </h1>
            <p
              className="lead"
              style={{
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
                fontSize: "1.2rem",
              }}
            >
              Skills for your present and your future. Get started with us.
            </p>
            <Button
              className="btn btn-light btn-lg mt-3"
              onClick={() => Navigate("/courses")}
              style={{
                backgroundColor: "#fff",
                color: "#4facfe",
                border: "none",
                fontWeight: "bold",
              }}
            >
              Browse Courses
            </Button>
          </Col>
          <Col lg={6} className="text-center">
            <img
              src="https://www.themeqx.com/wp-content/uploads/2020/06/teachify-lms-banner.png"
              alt="Banner"
              className="img-fluid rounded shadow-lg"
              style={{
                maxHeight: "400px",
                zIndex: 1,
                boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
              }}
            />
            <div
              className="position-absolute w-100 h-100 top-0 start-0"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
                zIndex: 0,
              }}
            ></div>
          </Col>
        </Row>

        {/* Featured Courses Section */}
        <Row className="py-4 bg-light">
          <Col>
            <h2 className="text-center fw-bold mb-4">Featured Courses</h2>
            <Row className="g-4">
              {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                studentViewCoursesList.map((courseItem) => (
                  <Col sm={6} lg={3} key={courseItem._id}>
                    <Link
                      to={`/courses`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                      }}
                    >
                      <Card className="h-100 shadow-lg border-0 course-card">
                        <Card.Img
                          variant="top"
                          src={`${server_url}/${courseItem.image}`}
                          alt={courseItem.title}
                          style={{
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                        <Card.Body>
                          <Card.Title className="text-primary">
                            {courseItem.title}
                          </Card.Title>
                          <Card.Text>
                            <small className="text-muted">
                              {courseItem.instructorName}
                            </small>
                          </Card.Text>
                          <Card.Text className="fw-bold text-success">
                            ${courseItem.price.toFixed(2)}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))
              ) : (
                <h4 className="text-center">No Courses Found</h4>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Home;
