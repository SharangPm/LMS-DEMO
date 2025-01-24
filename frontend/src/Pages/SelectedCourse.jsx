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
  }
 
];

const SelectedCourse = () => {
  return (
    <>
    <div>
     
      <Header/>
      <Container>
        <Row>
          <Col>
            <h1>Selected Course</h1>
           
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

export default SelectedCourse;
