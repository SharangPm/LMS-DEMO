import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Nav, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI, verifyOTPAPI } from "../services/allAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpInput from "./Otpinput";


function Authentication() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const [otp, setOtp] = useState("");
  const [emailForOTP, setEmailForOTP] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginType, setLoginType] = useState("user");

  // OTP cooldown timer
  useEffect(() => {
    let interval;
    if (otpCooldown > 0) {
      interval = setInterval(() => {
        setOtpCooldown(prev => prev - 1);
      }, 1000);
    } else {
      setCanResendOTP(true);
    }
    return () => clearInterval(interval);
  }, [otpCooldown]);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setShowOtpField(false);
    setOtp("");
  };

  const handleSelectLoginType = (type) => setLoginType(type);
  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = userData;

    // Check if all fields are filled
    if (!username || !email || !password) {
      toast.info("Please fill in all fields");
      return;
    }
    
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Check if the email is valid
    if (!emailRegex.test(email)) {
      toast.info("Please enter a valid email address");
      return;
    }
    
    // If all checks pass, proceed with your logic
    setIsLoading(true);
    try {
      const regResult = await registerAPI(userData);
  
      if (regResult.status === 200) {
        toast.success("Registration successful!");
        navigate("/login");
        setIsLogin(true);
        // Clear username but keep email/password for login
        setUserData(prev => ({ ...prev, username: "" }));
      }
    } catch (error) {
      // Handle duplicate email error
      if (error.response?.status === 409) {
        toast.error("This email is already registered. Please login instead.");
        setIsLogin(true); // Automatically switch to login form
      } else {
        toast.error(error.response?.data?.message || "Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userData;
  
    if (!email || !password) {
      toast.info("Please fill in all fields");
      return;
    }
  
    setIsLoading(true);
    try {
      if (loginType === 'admin' || loginType === 'instructor') {
        const result = await loginAPI({ 
          email, 
          password,
          role: loginType 
        });
  
        if (result.status === 200) {
          sessionStorage.setItem("role", result.data.role);
          sessionStorage.setItem("email", result.data.email);
          navigate(loginType === 'admin' ? "/admin" : "/instructor");
        }
      } else {
        const result = await loginAPI({ email, password });
        if (result.status === 200) {
          setShowOtpField(true);
          setEmailForOTP(email);
          setOtpCooldown(30);
          setCanResendOTP(false);
          toast.info("OTP sent to your email");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.warning("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTPAPI({ email: emailForOTP, otp });
      
      if (result.status !== 200) {
        toast.error(result.data?.message || "OTP verification failed");
        return;
      }

      // Store user data and redirect
      sessionStorage.setItem("token", result.data.token);
      sessionStorage.setItem("role", result.data.existingUser.role);
      sessionStorage.setItem("username", result.data.existingUser.username);
      sessionStorage.setItem("userId", result.data.existingUser._id);

      switch(result.data.existingUser.role) {
        case 'admin':
          navigate("/admin");
          break;
        case 'instructor':
          navigate("/instructor");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResendOTP) return;

    setIsLoading(true);
    try {
      const result = await loginAPI({
        email: emailForOTP,
        password: userData.password
      });

      if (result.status === 200) {
        setOtpCooldown(30);
        setCanResendOTP(false);
        toast.success("New OTP sent to your email");
      }
    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="auth-container">
      <Row className="d-flex align-items-center vh-100">
        <Col lg={6} className="auth-image d-none d-lg-block">
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
                <Nav variant="tabs" defaultActiveKey="user" onSelect={handleSelectLoginType} className="mb-3">
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
                  <Form.Group controlId="login-email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="login-password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={userData.password}
                      onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    />
                  </Form.Group>

                  {showOtpField && loginType === 'user' && (
                    <Form.Group controlId="login-otp" className="mb-3">
                      <Form.Label>OTP Verification</Form.Label>
                      <OtpInput onOtpChange={setOtp} />
                      <div className="text-center mt-2">
                        <Button
                          variant="link"
                          onClick={handleResendOTP}
                          disabled={!canResendOTP || isLoading}
                        >
                          {isLoading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            `Resend OTP ${otpCooldown > 0 ? `(${otpCooldown}s)` : ''}`
                          )}
                        </Button>
                      </div>
                    </Form.Group>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                    onClick={showOtpField ? handleVerifyOTP : handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span>Processing... <Spinner animation="border" size="sm" /></span>
                    ) : (
                      showOtpField ? "Verify OTP" : "Login"
                    )}
                  </Button>
                </Form>
              ) : (
                <Form>
                  <Form.Group controlId="signup-name" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={userData.username}
                      onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="signup-email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group controlId="signup-password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Create a password"
                      value={userData.password}
                      onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                    onClick={handleRegister}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span>Processing... <Spinner animation="border" size="sm" /></span>
                    ) : (
                      "Sign Up"
                    )}
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
      <ToastContainer position="top-center" autoClose={3000} />
    </Container>
  );
}

export default Authentication;