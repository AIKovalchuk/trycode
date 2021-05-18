import React from "react";
import { Button, Nav, Navbar, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../../provider/auth/Auth";

import "./header.scss";

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  return (
    <Navbar>
      <Navbar.Brand href="/">TryCode</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        {currentUser ? (
          <Nav>
            <Navbar.Text>Signed in as: {currentUser.email}</Navbar.Text>
            <Button onClick={logout}>Logout</Button>
          </Nav>
        ) : (
          <Nav>
            <LinkContainer to="/login">
              <Nav.Link>Log In</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/signup">
              <Nav.Link>Sign Up</Nav.Link>
            </LinkContainer>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
