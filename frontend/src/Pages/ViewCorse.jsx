import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Accordion, Button, Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { server_url } from '../services/serverurl';
import html2pdf from 'html2pdf.js';

function ViewCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`${server_url}/courses/${id}`);
        setCourse(response.data[0]);

        // Fetch user progress from sessionStorage
        const userId = sessionStorage.getItem('userId');
        if (userId) {
          const progressRes = await axios.get(`${server_url}/userProgress`, {
            params: { userId, courseId: id },
          });

          if (progressRes.data.completedVideos) {
            setCompletedVideos(progressRes.data.completedVideos);
            sessionStorage.setItem(`progress_${id}`, JSON.stringify(progressRes.data.completedVideos));
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleVideoCompletion = async (index) => {
    if (!completedVideos.includes(index)) {
      const updatedProgress = [...completedVideos, index];
      setCompletedVideos(updatedProgress);
      sessionStorage.setItem(`progress_${id}`, JSON.stringify(updatedProgress));

      try {
        const userId = sessionStorage.getItem('userId');
        await axios.post(`${server_url}/updateProgress`, {
          userId,
          courseId: id,
          videoIndex: index,
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const isCourseCompleted = () => {
    return course && course.videos && completedVideos.length === course.videos.length;
  };
  const generateCertificate = () => {
    setImagesLoaded(false);
    setShowCertificateModal(true);
    
    // Preload external images
    const imageUrls = [
      'https://e7.pngegg.com/pngimages/826/933/png-clipart-learning-management-system-education-lms-blue-text.png',
      'https://pbs.twimg.com/media/D9z0TuNU4AAp6HZ?format=jpg&name=4096x4096'
    ];

    Promise.all(imageUrls.map(url => 
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = (err) => reject(err);
      })
    ))
    .then(() => setImagesLoaded(true))
    .catch(error => {
      console.error('Error preloading images:', error);
      setImagesLoaded(true); // Continue even if some images fail
    });
  };
  const downloadCertificate = () => {
    const element = document.getElementById('certificateContent');
    const options = {
      filename: `${course.title}_Certificate.pdf`,
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        onclone: (clonedDoc) => {
          // Ensure all images are loaded
          clonedDoc.querySelectorAll('img').forEach(img => {
            if (!img.complete || img.naturalWidth === 0) {
              img.alt = 'Image not available';
              img.style.backgroundColor = '#f0f0f0'; // Placeholder style
            }
          });
        }
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
    };

    // Ensure images are loaded before generating the PDF
    if (imagesLoaded) {
      html2pdf()
        .set(options)
        .from(element)
        .save();
    } else {
      alert('Please wait until all images are loaded.');
    }
};

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
    <Container
      fluid
      className="py-5"
      style={{
        background: 'linear-gradient(to right,rgb(1, 11, 13),rgba(20, 76, 173, 0.79))',
        minHeight: '100vh',
      }}
    >
      <Row className="justify-content-center mb-5">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
            <Card.Body className="p-4">
              <h2 className="text-primary font-weight-bold">{course.title}</h2>
              <p className="text-muted">{course.description}</p>
              <div className="d-flex justify-content-between mt-3">
                <div>
                  <strong>Instructor:</strong> {course.instructorName}
                </div>
                <div>
                  <strong>Level:</strong> {course.level}
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <div>
                  <strong>Category:</strong> {course.category}
                </div>
                <div>
                  <strong>Published:</strong> {new Date(course.publishDate).toLocaleDateString()}
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <div>
                  <strong>Lectures:</strong> {course.videos?.length || 0}
                </div>
                <div>
                  <strong>Price:</strong> ${course.price}
                </div>
              </div>
              <Button variant="primary" className="mt-3 w-100" href={`#lectures`} size="lg">
                Start Learning
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Accordion for lectures */}
      <Row id="lectures" className="justify-content-center">
        <Col md={8} lg={6}>
          <Accordion defaultActiveKey="0">
            {course.videos?.map((videoUrl, index) => (
              <Card key={index} className="mb-3 shadow-lg">
                <Accordion.Item eventKey={String(index)}>
                  <Accordion.Header>
                    <strong>Lecture {index + 1}</strong>
                    {completedVideos.includes(index) && <span className="ms-2 text-success">✔</span>}
                  </Accordion.Header>
                  <Accordion.Body>
                    <ReactPlayer
                      url={`${server_url}/${videoUrl}`}
                      width="100%"
                      height="400px"
                      controls
                      onEnded={() => handleVideoCompletion(index)}
                    />
                  </Accordion.Body>
                </Accordion.Item>
              </Card>
            ))}
          </Accordion>
        </Col>
      </Row>

      
       {/* Certificate Modal */}
  <Modal show={showCertificateModal} onHide={() => setShowCertificateModal(false)} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Certificate of Completion</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div
        id="certificateContent"
        style={{
          fontFamily: "'Arial', sans-serif",
          textAlign: "center",
          padding: "40px",
          border: "10px solid gold",
          borderRadius: "15px",
          backgroundColor: "#fdfdfd",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
          position: "relative"
        }}
      >
        {!imagesLoaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Spinner animation="border" variant="primary" />
          </div>
        )}

<img
  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkUco9a_z6BnLE-blRl77JQOeiNAorcTXfMA&s"
  alt="Logo"
  onError={(e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = 'path/to/fallback-image.png'; // Fallback image
  }}
  style={{ width: "100px", marginBottom: "20px" }}
/>

        <h1 style={{ color: "#2c3e50", fontSize: "2.5rem", marginBottom: "10px" }}>
          Certificate of Completion
        </h1>
        <hr style={{ border: "2px solid gold", width: "50%", margin: "10px auto" }} />
        <p style={{ fontSize: "1.2rem", color: "#555", marginTop: "20px" }}>This is to certify that</p>
        <h2 style={{ color: "#2c3e50", fontSize: "2rem", fontWeight: "bold", margin: "10px 0" }}>
          {sessionStorage.getItem("username") || "Student Name"}
        </h2>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>has successfully completed the course</p>
        <h3 style={{ color: "#2980b9", fontSize: "1.5rem", fontWeight: "bold" }}>{course.title}</h3>
        <p style={{ fontSize: "1rem", color: "#777" }}>
          Instructor: <strong>{course.instructorName}</strong>
        </p>
        <p style={{ fontSize: "1rem", color: "#777" }}>
          Date: <strong>{new Date().toLocaleDateString()}</strong>
        </p>
        <img
          src="https://pbs.twimg.com/media/D9z0TuNU4AAp6HZ?format=jpg&name=4096x4096"
          alt="Signature"
          crossOrigin="anonymous"
          style={{ width: "150px", marginTop: "20px" }}
        />
        <p style={{ fontSize: "1rem", color: "#555" }}>Instructor Signature</p>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowCertificateModal(false)}>
        Close
      </Button>
      <Button 
        variant="primary" 
        onClick={downloadCertificate}
        disabled={!imagesLoaded}
      >
        {imagesLoaded ? 'Download Certificate' : 'Loading Images...'}
      </Button>
    </Modal.Footer>
  </Modal>
      {/* Generate Certificate Button */}
      {isCourseCompleted() && (
        <Row className="justify-content-center mt-5">
          <Col md={8} lg={6}>
            <Button variant="success" className="w-100" size="lg" onClick={generateCertificate}>
              Generate Certificate
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default ViewCourse;
