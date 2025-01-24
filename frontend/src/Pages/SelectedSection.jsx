import React from 'react';
import { Container, Button, Row, Col, Form, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Components/Header';
import Footer from '../Components/Footer'
const courses = [
  { 
    title: 'CSS Full Course 2025', 
    creator: 'Sangam Mukherjee', 
    lectures: 1, 
    level: 'INTERMEDIATE', 
    price: 20, 
    image: 'https://devlibrary.b-cdn.net/wp-content/uploads/2022/09/Web-Development-Course.png' 
  },
  { 
    title: 'React Native Full Course 2025', 
    creator: 'Sangam Mukherjee', 
    lectures: 5, 
    level: 'INTERMEDIATE', 
    price: 50, 
    image: 'https://i.ytimg.com/vi/nTeuhbP7wdE/maxresdefault.jpg' 
  },
  { 
    title: 'React & Redux Complete Course 2024', 
    creator: 'Sangam Mukherjee', 
    lectures: 4, 
    level: 'BEGINNER', 
    price: 100, 
    image: 'https://i.ytimg.com/vi/JmSf80PsYRw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAcjuLXpQ1rs6uzZFCDK4QWC152Tw' 
  },
  { 
    title: 'CSS Full Course 2025', 
    creator: 'Sangam Mukherjee', 
    lectures: 1, 
    level: 'INTERMEDIATE', 
    price: 20, 
    image: 'https://devlibrary.b-cdn.net/wp-content/uploads/2022/09/Web-Development-Course.png' 
  },
  { 
    title: 'React Native Full Course 2025', 
    creator: 'Sangam Mukherjee', 
    lectures: 5, 
    level: 'INTERMEDIATE', 
    price: 50, 
    image: 'https://i.ytimg.com/vi/nTeuhbP7wdE/maxresdefault.jpg' 
  }
];

const SelectedSection = () => {
  return (
    <>
    <div>
     
      <Header/>
      <Container>
        <Row>
          <Col>
            <h1>Selected Section</h1>
           
            <p>6 Results</p>
          </Col>
        </Row>
        <Row>
        {courses.map((course, index) => (
                      <Col key={index} md={4}>
                        <Card style={{ margin: '10px' }}>
                          <Card.Img 
                            variant="top" 
                            src={course.image} 
                            alt={course.title} 
                          />
                          <Card.Body>
                            <Card.Title>{course.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                              Created by {course.creator}
                            </Card.Subtitle>
                            <Card.Text>
                              {course.lectures} Lectures - {course.level} Level
                              <br />
                              ${course.price}
                            </Card.Text>
                            <Button variant="primary">Buy Now</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
        </Row>
      </Container>
    </div>
    <Footer/>
    </>
  );
};

export default SelectedSection;
