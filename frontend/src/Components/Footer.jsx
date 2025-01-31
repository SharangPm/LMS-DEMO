import React from 'react';
import { Container, Row, Col, Nav, Navbar } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ background: "linear-gradient(90deg,rgb(80,72,229),rgb(80,72,229), hsl(233, 76.20%, 62.20%))", color: '#fff', padding: '40px 0' }}>
      <Container>
        <Row>
          <Col md={4}>
            <h5>LMS</h5>
            <p>Enhancing learning experiences through technology. Join us and start your learning journey today!</p>
          </Col>
          <Col md={4}>
            
          </Col>
          <Col md={4}>
            <h5>Connect with Us</h5>
            <div>
              <a href="https://facebook.com" className="text-white mr-3"><FaFacebook size={30} /></a>
              <a href="https://twitter.com" className="text-white mr-3"><FaTwitter size={30} /></a>
              <a href="https://linkedin.com" className="text-white mr-3"><FaLinkedin size={30} /></a>
              <a href="https://instagram.com" className="text-white"><FaInstagram size={30} /></a>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} LMS. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
