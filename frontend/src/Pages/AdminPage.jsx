import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import axios from "axios";
import { server_url } from "../services/serverurl";

function AdminPage() {
  const [courses, setCourses] = useState([]);

  // Fetch all courses (pending and approved)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${server_url}/courses`); // Fetch all courses
        
        setCourses(response.data);
      } catch (error) {
        console.error(error);
        alert("Error fetching courses!");
      }
    };
    fetchCourses();
  }, []);

  // Approve course
  const handleApprove = async (courseId) => {
    try {
      await axios.put(`${server_url}/approvecourse/${courseId}`);
      // Update the course list to reflect the approval status change
      setCourses(courses.map((course) =>
        course._id === courseId ? { ...course, approvalStatus: "Approved" } : course
      ));
    } catch (error) {
      console.error(error);
      alert("Error approving the course!");
    }
  };

  // Reject course
  const handleReject = async (courseId) => {
    try {
      await axios.put(`${server_url}/rejectcourse/${courseId}`);
      // Update the course list to reflect the rejection status change
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error(error);
      alert("Error rejecting the course!");
    }
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4 text-warning">Requested Courses</h1>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Instructor</th>
            <th>Image</th> {/* New column for Image */}
            <th>Video</th> {/* New column for Video */}
            <th>Approval Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.price}</td>
              <td>{course.instructorName}</td>

              {/* Display Image */}
              <td>
                {course.image ? (
                  <img
                    src={`${server_url}/${course.image}`} // Assuming your server serves images from this URL
                    alt={course.title}
                    style={{ width: "100px", height: "auto" }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>

              {/* Display Video */}
              <td>
                {course.video ? (
                  <video width="100" controls>
                    <source src={`${server_url}/${course.video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <span>No Video</span>
                )}
              </td>

              <td>{course.approvalStatus}</td>
              <td>
                {course.approvalStatus === "Pending" ? (
                  <>
                    <Button variant="success m-2" onClick={() => handleApprove(course._id)}>
                      Approve
                    </Button>{" "}
                    <Button variant="danger ms-2 p-3" onClick={() => handleReject(course._id)}>
                      Reject
                    </Button>
                  </>
                ) : (
                  <span>Approved</span> // Display if the course is already approved
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminPage;
