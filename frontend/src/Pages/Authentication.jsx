import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../services/allAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Authentication() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginType, setLoginType] = useState("user"); // 'user', 'admin', or 'instructor'

  const predefinedCredentials = {
    admin: { email: "admin@123.com", password: "123" },
    instructor: { email: "instructor@123.com", password: "123" },
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSelectLoginType = (type) => {
    setLoginType(type);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = userData;

    if (!username || !email || !password) {
      toast.info("Please fill in all fields");
    } else {
      try {
        const result = await registerAPI(userData);
        if (result.status === 200) {
          toast.success(`${result.data.username} has successfully registered`);
          sessionStorage.setItem("username", result.data.newUser.username);
          sessionStorage.setItem("token", result.data.token);
          sessionStorage.setItem("userId", result.data.newUser._id);
          navigate("/");
          setUserData({ username: "", email: "", password: "" });
        } else {
          toast.warning("Error in registration");
        }
      } catch (error) {
        toast.error("Registration failed");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userData;

    if (!email || !password) {
      toast.info("Please fill in all fields");
    } else if (loginType === "admin" || loginType === "instructor") {
      const credentials = predefinedCredentials[loginType];
      if (email === credentials.email && password === credentials.password) {
        toast.success(`${loginType} logged in successfully`);
        sessionStorage.setItem("username", loginType);
        sessionStorage.setItem("userId", loginType);

        if (loginType === "admin") {
          navigate("/admin");
        } else if (loginType === "instructor") {
          navigate("/instructor");
        }

        setUserData({ username: "", email: "", password: "" });
      } else {
        toast.error("Invalid email or password for " + loginType);
      }
    } else {
      try {
        const result = await loginAPI({ email, password });
        if (result.status === 200) {
          sessionStorage.setItem("username", result.data.existingUser.username);
          sessionStorage.setItem("token", result.data.token);
          sessionStorage.setItem("userId", result.data.existingUser._id);

          navigate("/user-dashboard");
          setUserData({ username: "", email: "", password: "" });
        } else {
          toast.warning(result.response.data);
        }
      } catch (err) {
        toast.error("Login failed");
      }
    }
  };

  return (
    <Container fluid className="auth-container">
      <Row className="d-flex align-items-center vh-100">
        <Col lg={6} className="auth-image">
          <img
            src="https://media.istockphoto.com/id/1281150061/vector/register-account-submit-access-login-password-username-internet-online-website-concept.jpg?s=612x612&w=0&k=20&c=9HWSuA9IaU4o-CK6fALBS5eaO1ubnsM08EOYwgbwGBo="
            alt="Authentication Illustration"
            className="img-fluid"
            style={{ objectFit: "cover", height: "100%" }}
          />
        </Col>
        <Col lg={6} className="auth-form">
          <Card className="shadow-lg rounded-lg p-4">
            <Card.Body>
              <h2 className="text-center mb-4" style={{ color: "#6a11cb" }}>
                {isLogin ? "Login" : "Sign Up"}
              </h2>

              {isLogin && (
                <Nav
                  variant="tabs"
                  defaultActiveKey="user"
                  onSelect={handleSelectLoginType}
                  className="mb-3"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="user">User</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="admin">Admin</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="instructor">Instructor</Nav.Link>
                  </Nav.Item>
                </Nav>
              )}

              {isLogin ? (
                <Form>
                  <Form.Group controlId="login-email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="login-password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                    onClick={(e) => handleLogin(e)}
                  >
                    Login
                  </Button>
                </Form>
              ) : (
                <Form>
                  <Form.Group controlId="signup-name">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      onChange={(e) =>
                        setUserData({ ...userData, username: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="signup-email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="signup-password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Create a password"
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                    onClick={(e) => handleRegister(e)}
                  >
                    Sign Up
                  </Button>
                </Form>
              )}

              <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={handleToggleForm}
                  style={{ textDecoration: "none", color: "#6a11cb" }}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Login"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer position="top-center" />
    </Container>
  );
}

export default Authentication;
