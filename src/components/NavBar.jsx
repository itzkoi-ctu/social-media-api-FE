import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../page/AuthContext";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

export default function AppNavbar() {
  const { isAuthenticated, logout, userId } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-phone me-2"></i>
          SocialApp
        </Navbar.Brand>
        <Nav>
        <Nav.Link as={Link} to="/posts">All Posts</Nav.Link>

        </Nav>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/signin">Sign In</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to={`/my-profile/${userId}/details`}>My Profile</Nav.Link>
                <Nav.Link as={Link} to={`/posts/mypost/${userId}`}>My Posts</Nav.Link>
                <Nav.Link as={Link} to="/create-post">Create Post</Nav.Link>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}