// Home.js
import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import Header from "../Components/Header";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import axios from "axios";
import { server_url } from "../services/serverurl";
import Chat from "./Chat";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", bounce: 0.4, duration: 0.8 }
  }
};

function Home() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${server_url}/selectedCourses`);
        const approvedCourses = response.data.filter(course => course.approvalStatus === 'Approved');
        setCourses(approvedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="overflow-hidden">
      <Header Auth />
      
      {/* Parallax Hero Section */}
      <section className="hero-section position-relative min-vh-100 d-flex align-items-center">
        <motion.div style={{ y: y1 }} className="parallax-bg w-100 h-100 position-absolute"></motion.div>
        
        <Container className="position-relative z-index-2">
          <Row className="align-items-center py-5">
            <Col lg={6} className="text-white pe-lg-5">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-3 fw-bold mb-4">Transform Your Future Through Learning</h1>
                <p className="lead mb-5 fs-4 opacity-75">
                  Master in-demand skills with industry experts. Start your journey today with our curated courses.
                </p>
                <Button 
                  variant="light" 
                  size="lg" 
                  className="rounded-pill px-4 py-3 shadow-lg"
                  onClick={() => navigate("/courses")}
                >
                  Explore Courses <FiArrowRight className="ms-2" />
                </Button>
              </motion.div>
            </Col>
            
            <Col lg={6} className="mt-5 mt-lg-0">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{ y: y2 }}
              >
                <div className="hero-illustration position-relative p-5">
                  <div className="glow-effect position-absolute"></div>
                  <img 
                    src="https://d8285fmxt3duy.cloudfront.net/public/articulos/img/2023/gestion-aprendizaje.png" 
                    alt="Learning Illustration" 
                    className="img-fluid" 
                  />
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-9 bg-white position-relative overflow-hidden">
  <Container className="py-5">
    <div className="text-center mb-8 position-relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="display-4 fw-bold mb-3 text-primary-gradient">
          Featured Courses
        </h2>
        <p className="lead text-muted-800 mb-4 shimmer-text-light">
          Curated Knowledge from Industry Experts
        </p>
        <div className="sliding-bar-light mx-auto mb-4"></div>
      </motion.div>
    </div>

    <Row className="g-5 gx-5 mb-6">
      {courses.slice(0, 8).map((course) => (
        <Col key={course._id} xs={12} md={6} lg={4} xl={3}>
          <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              to={`/courses`}
              className="text-decoration-none text-inherit h-100 d-block"
            >
              <Card className="h-100 border-0 shadow-soft-hover bg-white">
                <div className="card-media-wrapper overflow-hidden position-relative rounded-top">
                  <img
                    src={`${server_url}/${course.image}`}
                    alt={course._id}
                    className="card-img-top scale-on-hover"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="course-badge position-absolute bg-white text-dark py-2 px-4 skew-badge border">
                    <span className="d-inline-block transform-skew fw-medium">
                      Featured
                    </span>
                  </div>
                  <div className="hover-info-box position-absolute w-100 p-3 bg-white-95">
                    <div className="d-flex justify-content-between text-dark opacity-90">
                      <span>
                        <i className="bi bi-clock me-1 text-primary"></i>
                        
                      </span>
                      <span>
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        
                      </span>
                    </div>
                  </div>
                </div>

                <Card.Body className="position-relative pt-4 pb-3 px-4">
                  <div className="course-category-tag bg-light-primary position-absolute top-0 start-50 translate-middle px-3 py-1 rounded-pill">
                    {course.category}
                  </div>
                  <Card.Title className="text-dark mb-2 fs-5 fw-bold line-clamp-2">
                    {course.title}
                  </Card.Title>
                  <Card.Text className="d-flex align-items-center mb-3">
                   
                    <small className="text-dark opacity-80">
                      {course.instructorName}
                    </small>
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="price-display bg-light-success px-3 py-1 rounded-pill border">
                      <span className="text-dark fw-bold">
                        ${course.price.toFixed(2)}
                      </span>
                    </div>
                    <button className="btn btn-icon btn-hover-light">
                      <i className="bi bi-arrow-right-short fs-4 text-dark"></i>
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </motion.div>
        </Col>
      ))}
    </Row>
  </Container>

  <style jsx global>{`
    .text-primary-gradient {
      background: linear-gradient(45deg, #2563eb 0%, #4f46e5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .shadow-soft-hover {
      transition: all 0.4s ease;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.06);
    }
    .shadow-soft-hover:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      border-color: rgba(0,0,0,0.1);
    }
    .skew-badge {
      transform: skewX(-15deg);
      top: 15px;
      left: -10px;
      box-shadow: 2px 2px 8px rgba(0,0,0,0.08);
    }
    .hover-info-box {
      bottom: -100%;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
    }
    .card-media-wrapper:hover .hover-info-box {
      bottom: 0;
    }
    .bg-white-95 {
      background: rgba(255,255,255,0.95);
    }
    .btn-hover-light:hover {
      background: rgba(0,0,0,0.04);
    }
    .shimmer-text-light::after {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(0,0,0,0.08),
        transparent
      );
    }
    .sliding-bar-light {
      width: 120px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #e0e7ff, transparent);
      position: relative;
      overflow: hidden;
    }
    .sliding-bar-light::after {
      background: linear-gradient(90deg, transparent, #6366f1, transparent);
    }
    .bg-light-primary {
      background-color: #e0e7ff;
    }
    .bg-light-success {
      background-color: #dcfce7;
    }
    .scale-on-hover {
      transition: transform 0.3s ease;
    }
    .scale-on-hover:hover {
      transform: scale(1.05);
    }
  `}</style>
</section>
     
     
      {token && <Chat senderType="user" />}
      <Footer />
    </div>
  );
}

export default Home;