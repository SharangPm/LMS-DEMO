import React, { useState, useEffect, useMemo } from 'react';
import { Container, Button, Row, Col, Form, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { server_url } from '../services/serverurl';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Courses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');

  const fetchCourses = async () => {
    try {
      let response;
      if (!userId) {
        response = await axios.get(`${server_url}/courses`);
      } else {
        response = await axios.get(`${server_url}/coursespurchase/${userId}`);
      }
      setAllCourses(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Error fetching courses!');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [userId]);

  const displayedCourses = useMemo(() => {
    const filtered = allCourses.filter(course => {
      const query = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.instructorName.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
      );
    });

    let sorted = [...filtered];
    switch (sortBy) {
      case 'Price: Low to High':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        break;
    }
    return sorted;
  }, [allCourses, searchQuery, sortBy]);

  const handleBuyNow = async (courseId, amount) => {
    try {
      const { data: order } = await axios.post(`${server_url}/create-order`, { amount });

      const options = {
        key: 'rzp_test_PrgkRRJxtFY1tP',
        amount: order.amount,
        currency: order.currency,
        name: 'Course Purchase',
        description: 'Payment for course',
        image: 'https://static.vecteezy.com/system/resources/previews/009/225/699/non_2x/lms-learning-management-system-vector.jpg',
        order_id: order.id,
        handler: async function (response) {
          try {
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

            await fetchCourses();
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
  const handletoken = () => {
    if(sessionStorage.getItem('token') === null){
      navigate('/register');
    }
   }

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
      <Container fluid className="px-5" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }} onClick={()=>{handletoken()}}>
        <div className="py-5 text-center">
          <h1 className="display-4 fw-bold" style={{ 
            background: 'linear-gradient(45deg, #6C63FF, #FF6B6B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Master Your Future
          </h1>
          <p className="lead text-muted">Discover courses that will shape your career path</p>
        </div>

        <Row className="align-items-center mb-5 g-3">
          <Col xs={12} md={6} lg={4}>
            <Form.Control
              type="search"
              placeholder="🔍 Search courses by title, instructor name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shadow-sm"
              style={{
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.75rem 1.25rem',
                fontWeight: '500'
              }}
            />
          </Col>
          <Col xs={6} md={3} lg={4} className="text-md-center">
            <h5 className="text-muted mb-0">
              {displayedCourses.length} {displayedCourses.length === 1 ? 'Course' : 'Courses'} Available
            </h5>
          </Col>
          <Col xs={6} md={3} lg={4}>
            <Form.Select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
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
          </Col>
        </Row>

        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {displayedCourses.map((course, index) => (
            <Col key={index} className="mb-4">
              <Card className="h-100 shadow-lg border-0" style={{
                borderRadius: '15px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                overflow: 'hidden'
              }}>
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
                  
                { userId && <Button 
                    variant="primary" 
                    className="mt-auto"
                    onClick={() => handleBuyNow(course._id, course.price)}
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
                    Enroll Now <i className="fas fa-arrow-right ms-2"></i>
                  </Button>}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: '#6C63FF',
          color: 'white',
          borderRadius: '10px'
        }}
      />
    </>
  );
};

export default Courses;