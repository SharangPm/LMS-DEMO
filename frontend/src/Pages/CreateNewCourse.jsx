import React, { useState } from "react";
import { Button, Card, Container, Row, Col, Form, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for making HTTP requests
import { server_url } from "../services/serverurl";
import Swal from "sweetalert2";

function CreateNewCourse() {
  const [activeSection, setActiveSection] = useState("courseLanding");
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    visibility: "Public",
    publishDate: "",
    videos: [], // Changed to an array for multiple videos
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

  // Handle file upload changes for videos and image
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "videos") {
      setCourseData((prevData) => ({
        ...prevData,
        [name]: Array.from(files), // Convert FileList to an array
      }));
    } else {
      setCourseData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(courseData).forEach((key) => {
      if (key === "videos") {
        courseData[key].forEach((video, index) => {
          formData.append(`videos`, video);
        });
      } else {
        formData.append(key, courseData[key]);
      }
    });

    try {
      const response = await axios.post(`${server_url}/addcourse`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });
      navigate("/"); // Navigate back to the admin or main page
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error adding the course. Please try again.",
      });
    }
  };

  return (
    <>
      <Container
        fluid
        className="p-4"
        style={{
          background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
          minHeight: "100vh",
        }}
      >
        {/* Back Button */}
        <Row className="mb-4">
          <Col>
            <Button
              variant="light"
              onClick={() => navigate(-1)}
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                padding: "10px 20px",
                fontWeight: "600",
              }}
            >
              &larr; Back to Admin View
            </Button>
          </Col>
        </Row>

        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#2c3e50",
              }}
            >
              Create a New Course
            </h1>
          </Col>
          <Col className="text-end">
            <Button
              variant="primary"
              className="px-4"
              onClick={handleSubmit}
              style={{
                borderRadius: "10px",
                padding: "10px 30px",
                fontWeight: "600",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              Submit
            </Button>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Nav
          variant="tabs"
          className="mb-4"
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Nav.Item>
            <Nav.Link
              active={activeSection === "courseLanding"}
              onClick={() => setActiveSection("courseLanding")}
              style={{
                fontWeight: "600",
                color: activeSection === "courseLanding" ? "#2c3e50" : "#6c757d",
                background: activeSection === "courseLanding" ? "#fff" : "#f8f9fa",
              }}
            >
              Course Details
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeSection === "settings"}
              onClick={() => setActiveSection("settings")}
              style={{
                fontWeight: "600",
                color: activeSection === "settings" ? "#2c3e50" : "#6c757d",
                background: activeSection === "settings" ? "#fff" : "#f8f9fa",
              }}
            >
              Settings
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Form Sections */}
        <Card
          className="shadow"
          style={{
            borderRadius: "15px",
            border: "none",
            overflow: "hidden",
          }}
        >
          <Card.Body style={{ padding: "2rem" }}>
            {activeSection === "courseLanding" && (
              <Form>
                <h4
                  className="mb-4"
                  style={{
                    color: "#2c3e50",
                    fontWeight: "700",
                    fontSize: "1.5rem",
                  }}
                >
                  Course Details
                </h4>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                    Course Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={courseData.title}
                    onChange={handleInputChange}
                    placeholder="Enter course title"
                    required
                    style={{
                      borderRadius: "10px",
                      padding: "10px",
                      border: "1px solid #ced4da",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={courseData.description}
                    onChange={handleInputChange}
                    placeholder="Enter course description"
                    required
                    style={{
                      borderRadius: "10px",
                      padding: "10px",
                      border: "1px solid #ced4da",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                    Price
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={courseData.price}
                    onChange={handleInputChange}
                    placeholder="Enter course price"
                    required
                    style={{
                      borderRadius: "10px",
                      padding: "10px",
                      border: "1px solid #ced4da",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                    Video Files
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/*"
                    name="videos"
                    onChange={handleFileChange}
                    multiple // Allow multiple files
                    required
                    style={{
                      borderRadius: "10px",
                      padding: "10px",
                      border: "1px solid #ced4da",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                    Image File
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleFileChange}
                    required
                    style={{
                      borderRadius: "10px",
                      padding: "10px",
                      border: "1px solid #ced4da",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                    Category
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={courseData.category}
                    onChange={handleInputChange}
                    placeholder="Enter course category (e.g., Web Development)"
                    required
                    style={{
                      borderRadius: "10px",
                      padding: "10px",
                      border: "1px solid #ced4da",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                    Number of Lectures
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="numberOfLectures"
                    value={courseData.numberOfLectures}
                    onChange={handleInputChange}
                    placeholder="Enter number of lectures"
                    required
                    style={{
                      borderRadius: "10px",
                      padding: "10px",
                      border: "1px solid #ced4da",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                    Instructor's Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="instructorName"
                    value={courseData.instructorName}
                    onChange={handleInputChange}
                    placeholder="Enter instructor's name"
                    required
                    style={{
                      borderRadius: "10px",
                      padding: "10px",
                      border: "1px solid #ced4da",
                    }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                    Difficulty Level
                  </Form.Label>
                  <Form.Select
                    name="level"
                    value={courseData.level}
                    onChange={handleInputChange}
                    required
                    style={{
                      borderRadius: "10px",
                      padding: "10px",
                      border: "1px solid #ced4da",
                    }}
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
                <h4
                  className="mb-4"
                  style={{
                    color: "#2c3e50",
                    fontWeight: "700",
                    fontSize: "1.5rem",
                  }}
                >
                  Settings
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label style={{ fontWeight: "600", color: "#495057" }}>
                        Publish Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="publishDate"
                        value={courseData.publishDate}
                        onChange={handleInputChange}
                        required
                        style={{
                          borderRadius: "10px",
                          padding: "10px",
                          border: "1px solid #ced4da",
                        }}
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