import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { server_url } from '../services/serverurl';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Newest');
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');

  // Fetch available courses
  useEffect(() => {
    if(!userId){    
      const fetchDatabeforelogin = async () => {
        try {
          const response = await axios.get(`${server_url}/courses`);
          setCourses(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching courses:', err);
          setError('Error fetching courses!');
          setLoading(false);
        }
      };
  
      fetchDatabeforelogin();
      
    }else{
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server_url}/coursespurchase/${userId}`);
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Error fetching courses!');
        setLoading(false);
      }
    };

    fetchData();
  }
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

  const handleBuyNow = async (courseId, amount) => {
    try {
      // Request an order from the backend
      const { data: order } = await axios.post(`${server_url}/create-order`, { amount });

      const options = {
        key: 'rzp_test_PrgkRRJxtFY1tP', // Razorpay API key
        amount: order.amount,
        currency: order.currency,
        name: 'Course Purchase',
        description: 'Payment for course',
        image: 'https://static.vecteezy.com/system/resources/previews/009/225/699/non_2x/lms-learning-management-system-vector.jpg',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Payment verification
            await axios.post(`${server_url}/verify-payment`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
              userId,
            });

            toast.success('🎉 Payment successful! The course has been added to your account. Happy learning!', {
              position: 'top-right',
              autoClose: 5000,
            });

            // Update the courses state to reflect the purchase
            setCourses((prevCourses) =>
              prevCourses.filter((course) => course._id !== courseId)
            );
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: 'Student Name',
          email: 'student@example.com',
          contact: '1234567890',
        },
        theme: {
          color: '#6C63FF',
        },
        method: 'upi',
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Error initializing payment!');
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header />
      <Container className="m-4">
        <Row>
          <Col>
            <h1 className="text-center mb-4 text-warning" style={{ fontWeight: 'bold' }}>
              Explore Available Courses
            </h1>
            <Form className="mb-4">
              <Form.Group controlId="formSortBy">
                <Form.Label className="text-muted">Sort By</Form.Label>
                <Form.Control as="select" value={sortBy} onChange={handleSortChange}>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </Form.Control>
              </Form.Group>
            </Form>
            <p className="text-muted">{courses.length} Results Found</p>
          </Col>
        </Row>
        <Row>
          {courses.map((course, index) => (
            <Col key={index} md={4}>
              <Card
                style={{
                  margin: '10px',
                  border: 'none',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                }}
              >
                <Card.Img
                  variant="top"
                  src={`${server_url}/${course.image}`}
                  alt={course.title}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px',
                  }}
                />
                <Card.Body>
                  <Card.Title className="text-dark">{course.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Created by {course.instructorName}
                  </Card.Subtitle>
                  <Card.Text className="text-secondary">
                    {course.numberOfLectures} Lectures - {course.level} Level
                    <br />
                    <strong>₹{course.price}</strong>
                  </Card.Text>
                  <Button
                    variant="primary"
                    style={{
                      background: 'linear-gradient(45deg, #6C63FF, #3F37C9)',
                      border: 'none',
                      width: '100%',
                      fontWeight: 'bold',
                      padding: '10px',
                      borderRadius: '20px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    onClick={() => handleBuyNow(course._id, course.price)}
                  >
                    Buy Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Courses;
