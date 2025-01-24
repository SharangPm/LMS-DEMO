import React, { useState } from "react";
import { Button, Card, Container, Row, Col, Form, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for making HTTP requests
import { server_url } from "../services/serverurl";
import Swal from 'sweetalert2';

function CreateNewCourse() {
  const [activeSection, setActiveSection] = useState("courseLanding");
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    visibility: "Public",
    publishDate: "",
    video: null,
    image: null,
    numberOfLectures: "",
    instructorName: "",
    level: "Beginner",
    category: "",
  });
  const navigate = useNavigate();

  // Handle input change for text and select fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file upload changes for video and image
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(courseData).forEach((key) => {
      formData.append(key, courseData[key]);
    });

    try {
      const response = await axios.post(`${server_url}/addcourse`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
      });
      navigate("/"); // Navigate back to the admin or main page
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error adding the course. Please try again.',
      });
    }
  };

  return (
    <>
    <Container className="py-4">
      {/* Back Button */}
      <Row className="mb-4">
        <Col>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            &larr; Back to Admin View
          </Button>
        </Col>
      </Row>

      {/* Page Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 font-weight-bold">Create a New Course</h1>
        </Col>
        <Col className="text-end">
          <Button variant="primary" className="px-4" onClick={handleSubmit}>
            Submit
          </Button>
        </Col>
      </Row>

      {/* Navigation Tabs */}
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeSection === "courseLanding"}
            onClick={() => setActiveSection("courseLanding")}
          >
            Course Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeSection === "settings"}
            onClick={() => setActiveSection("settings")}
          >
            Settings
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Form Sections */}
      <Card className="shadow">
        <Card.Body>
          {activeSection === "courseLanding" && (
            <Form>
              <h4 className="mb-3">Course Details</h4>

              <Form.Group className="mb-3">
                <Form.Label>Course Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  placeholder="Enter course title"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  placeholder="Enter course description"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleInputChange}
                  placeholder="Enter course price"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Video File</Form.Label>
                <Form.Control
                  type="file"
                  accept="video/*"
                  name="video"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image File</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={courseData.category}
                  onChange={handleInputChange}
                  placeholder="Enter course category (e.g., Web Development)"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Number of Lectures</Form.Label>
                <Form.Control
                  type="number"
                  name="numberOfLectures"
                  value={courseData.numberOfLectures}
                  onChange={handleInputChange}
                  placeholder="Enter number of lectures"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Instructor's Name</Form.Label>
                <Form.Control
                  type="text"
                  name="instructorName"
                  value={courseData.instructorName}
                  onChange={handleInputChange}
                  placeholder="Enter instructor's name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Difficulty Level</Form.Label>
                <Form.Select
                  name="level"
                  value={courseData.level}
                  onChange={handleInputChange}
                  required
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}

          {activeSection === "settings" && (
            <Form>
              <h4 className="mb-3">Settings</h4>
              <Row>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Publish Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="publishDate"
                      value={courseData.publishDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
   

    </>
    
  );
}

export default CreateNewCourse;
