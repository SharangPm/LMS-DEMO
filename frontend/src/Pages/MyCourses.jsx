import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Form, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { server_url } from '../services/serverurl';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Newest');
  const userId = sessionStorage.getItem('userId'); // Retrieving from sessionStorage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${server_url}/user-courses/${userId}`);
        setCourses(response.data); // Assuming the response contains an array of courses
        setLoading(false);
      } catch (err) {
        setError('Error fetching purchased courses!');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    if (e.target.value === 'Price: Low to High') {
      setCourses([...courses].sort((a, b) => a.price - b.price));
    } else if (e.target.value === 'Price: High to Low') {
      setCourses([...courses].sort((a, b) => b.price - a.price));
    } else {
      setCourses([...courses].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)));
    }
  };


  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
    </div>
  );

  if (error) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <h2 className="text-danger">⚠️ {error}</h2>
    </div>
  );

  return (
    <>
      <Header />
      <Container fluid className="px-5" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }} >
        <div className="py-5 text-center">
          <h1 className="display-4 fw-bold" style={{
            background: 'linear-gradient(45deg, #6C63FF, #FF6B6B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Master Your Future
          </h1>
         
        </div>

        <div className="d-flex justify-content-between align-items-center mb-5">
          <h5 className="text-muted mb-0">
            {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
          </h5>
          <Form style={{ width: '250px' }}>
            <Form.Select
              value={sortBy}
              onChange={handleSortChange}
              className="shadow-sm"
              style={{
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.75rem 1.25rem',
                fontWeight: '500'
              }}
            >
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </Form.Select>
          </Form>
        </div>

        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {courses.map((course, index) => (
            <Col key={index} className="mb-4">
              <Card className="h-100 shadow-lg border-0" style={{
                borderRadius: '15px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{
                  position: 'relative',
                  height: '250px',
                  overflow: 'hidden'
                }}>
                  <Card.Img
                    variant="top"
                    src={`${server_url}/${course.image}`}
                    alt={course.title}
                    style={{
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.9)'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    padding: '1rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                  }}>
                    <Card.Title className="text-white mb-0" style={{ fontSize: '1.5rem' }}>
                      {course.title}
                    </Card.Title>
                    <Card.Subtitle className="mt-1 text-white-50">
                      {course.instructorName}
                    </Card.Subtitle>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#6C63FF',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                  }}>
                    {course.level}
                  </div>
                </div>

                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-video me-2 text-secondary"></i>
                      <span className="text-muted">{course.numberOfLectures} Lectures</span>
                    </div>
                    <div className="text-primary fw-bold" style={{ fontSize: '1.25rem' }}>
                      ₹{course.price}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="mt-auto"
                    onClick={() => {
                      navigate(`/view/${course._id}`);
                    }}
                    style={{
                      background: 'linear-gradient(45deg, #6C63FF, #3F37C9)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Start Watching <i className="fas fa-arrow-right ms-2"></i>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </>
  );
};

export default MyCourses;
