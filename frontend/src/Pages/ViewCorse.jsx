import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { server_url } from '../services/serverurl';

function ViewCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`${server_url}/courses/${id}`);
        setCourse(response.data[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <strong>Error: </strong>{error}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'black'}}>  {/* Ensure the background fills the full screen */}
      <Container fluid style={{ backgroundColor: 'black'}}>  {/* Set full screen height */}
        <Row className="d-flex justify-content-center align-items-center vh-100">
          <Col lg={10} md={12}>
            <Card className="shadow-lg rounded-lg border-0 overflow-hidden">
              <Card.Body className="p-5" style={{ backgroundColor: 'white' }}>
                <Row>
                  {/* Left Column for Video */}
                  <Col md={6} className="mb-4 mt-5">
                    <div className="mb-5">
                      <h4 className="font-weight-bold mb-3" style={{ color: '#6C5B7B' }}>
                        Watch the Course Video
                      </h4>
                      <div className="video-container" style={{ position: 'relative', paddingTop: '56%' }}>
                        <ReactPlayer
                          url={`${server_url}/${course.video}`}
                          width="100%"
                          height="100%"
                          controls
                          playing
                          className="react-player"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                      </div>
                    </div>
                  </Col>

                  {/* Right Column for Course Details */}
                  <Col md={6} className='mt-5'>
                    <h2 className="text-warning font-weight-bold mb-3">{course.title}</h2>
                    <Card.Text className="lead text-muted mb-4">{course.description}</Card.Text>

                    <Row className="">
                      <Col sm={6}>
                        <h6><strong style={{ color: '#3498db' }}>Instructor:</strong> {course.instructorName}</h6>
                      </Col>
                      <Col sm={6}>
                        <h6><strong style={{ color: '#3498db' }}>Level:</strong> {course.level}</h6>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col sm={6}>
                        <h6><strong style={{ color: '#3498db' }}>Category:</strong> {course.category}</h6>
                      </Col>
                      <Col sm={6}>
                        <h6><strong style={{ color: '#3498db' }}>Published on:</strong> {new Date(course.publishDate).toLocaleDateString()}</h6>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col sm={6}>
                        <h6><strong style={{ color: '#3498db' }}>Lectures:</strong> {course.numberOfLectures}</h6>
                      </Col>
                      <Col sm={6}>
                        <h6><strong style={{ color: '#3498db' }}>Price:</strong> ${course.price}</h6>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ViewCourse;
