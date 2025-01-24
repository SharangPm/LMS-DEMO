import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Form, Card } from 'react-bootstrap';
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
  const navigate=useNavigate();
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header />
      <Container className='m-4'>
        <Row>
          <Col>
            <h1 className='text-warning text-center' style={{fontWeight:'bold'}}>Your Purchased Courses</h1>
            <Form>
              <Form.Group controlId="formSortBy">
                <Form.Label>Sort By</Form.Label>
                <Form.Control as="select" value={sortBy} onChange={handleSortChange}>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </Form.Control>
              </Form.Group>
            </Form>
            <p>{courses.length} Courses</p>
          </Col>
        </Row>
        <Row>
          {courses.map((course, index) => (
            <Col key={index} md={4}>
              <Card style={{ margin: '10px' }}>
                <Card.Img
                  variant="top"
                  src={`${server_url}/${course.image}`}
                  alt={course.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Created by {course.instructorName}
                  </Card.Subtitle>
                  <Card.Text>
                    {course.numberOfLectures} Lectures - {course.level} Level
                    <br />
                    ${course.price}
                  </Card.Text>
                  <Button
                    variant="primary"
                    style={{
                      background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 'bold',
                      padding: '0.5rem 1rem',
                      borderRadius: '30px',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
                    }}
                    onClick={() => {
                      navigate(`/view/${course._id}`);
                    }}
                  >
                    Start Watching
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
