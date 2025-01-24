import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Header({ Auth }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  function handleLogout() {
    sessionStorage.clear();
    navigate("/login");
  }

  return (
    <Navbar
      expand="lg"
      style={{
        background: "linear-gradient(90deg,rgb(95, 114, 192),rgb(13, 148, 132), #ff6a62)",
        padding: "1rem 0",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container>
        {/* Brand Section */}
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "1.8rem",
            color: "#ffffff",
            textDecoration: "none",
            gap: "0.8rem",
          }}
        >
          <GraduationCap
            size={34}
            style={{
              color: "#ffdf5d",
              transition: "transform 0.3s ease",
            }}
          />
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "1px",
            }}
          >
            Learn & Grow
          </span>
        </Navbar.Brand>

        {/* Navbar Toggler */}
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{
            border: "none",
            background: "#fff",
            padding: "0.5rem",
            borderRadius: "5px",
            transition: "transform 0.3s ease",
          }}
        />

        {/* Navbar Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="ms-auto"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            {/* Explore Courses */}
            <Nav.Link
              as="span"
              onClick={() => {
                if (!location.pathname.includes("/courses")) {
                  navigate("/courses");
                }
              }}
              style={{
                fontWeight: "600",
                color: "#fff",
                cursor: "pointer",
                transition: "color 0.3s ease",
                fontSize: "1.1rem",
                fontFamily: "'Roboto', sans-serif",
              }}
              onMouseEnter={(e) => (e.target.style.color = "rgba(255, 223, 93, 1)")}
              onMouseLeave={(e) => (e.target.style.color = "#ffffff")}
            >
              Explore Courses
            </Nav.Link>

            {/* My Courses - Visible only when token is available */}
            {token && (
              <Nav.Link
                onClick={() => navigate("/student-courses")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "600",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "1.1rem",
                  fontFamily: "'Roboto', sans-serif",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "rgba(255, 223, 93, 1)")}
                onMouseLeave={(e) => (e.target.style.color = "#ffffff")}
              >
                <span style={{ marginRight: "0.5rem" }}>My Courses</span>
                <TvMinimalPlay
                  size={26}
                  style={{
                    color: "#fff",
                    transition: "transform 0.3s ease",
                  }}
                />
              </Nav.Link>
            )}

            {/* Auth Buttons */}
            {!token ? (
              <Link
                to={"/register"}
                style={{
                  textDecoration: "none",
                }}
              >
                <Button
                  variant="primary"
                  style={{
                    background: "linear-gradient(45deg, #ffca28, #ff9800)",
                    border: "none",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "30px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
                  }}
                >
                  Log In
                </Button>
              </Link>
            ) : (
              <Button
                variant="danger"
                onClick={handleLogout}
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "30px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                Log Out
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
