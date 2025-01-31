import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { server_url } from "../services/serverurl";

function AdminPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${server_url}/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error(error);
        alert("Error fetching courses!");
      }
    };
    fetchCourses();
  }, []);

  const handleApprove = async (courseId) => {
    try {
      await axios.put(`${server_url}/approvecourse/${courseId}`);
      setCourses(courses.map((course) =>
        course._id === courseId ? { ...course, approvalStatus: "Approved" } : course
      ));
    } catch (error) {
      console.error(error);
      alert("Error approving the course!");
    }
  };

  const handleReject = async (courseId) => {
    try {
      await axios.put(`${server_url}/rejectcourse/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error(error);
      alert("Error rejecting the course!");
    }
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4 text-center text-warning">Admin Dashboard - Course Approvals</h1>
      <Row>
        {courses.map((course) => (
          <Col md={6} lg={4} key={course._id} className="mb-4">
            <Card className="shadow-lg border-0">
              <Card.Img variant="top" src={`${server_url}/${course.image}`} style={{ height: "200px", objectFit: "cover" }} />
              <Card.Body>
                <Card.Title className="text-primary">{course.title}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                <Card.Text><strong>Price:</strong> ${course.price.toFixed(2)}</Card.Text>
                <Card.Text><strong>Instructor:</strong> {course.instructorName}</Card.Text>
                <Card.Text>
                  <strong>Approval Status: </strong>
                  <span className={
                    course.approvalStatus === "Pending" ? "text-warning" :
                    course.approvalStatus === "Approved" ? "text-success" : "text-danger"
                  }>
                    {course.approvalStatus}
                  </span>
                </Card.Text>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {course.videos && course.videos.length > 0 ? (
                    course.videos.map((video, index) => (
                      <video key={index} width="100%" height="150" controls>
                        <source src={`${server_url}/${video}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ))
                  ) : (
                    <span>No Videos</span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  {course.approvalStatus === "Pending" ? (
                    <>
                      <Button variant="success" className="me-2" onClick={() => handleApprove(course._id)}>
                        Approve
                      </Button>
                      <Button variant="danger" onClick={() => handleReject(course._id)}>
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span className="text-success">Approved</span>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default AdminPage;
