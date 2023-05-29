import React from "react";
import { Nav, Row, Navbar, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function CheckoutStep({ step1, step2, step3, step4 }) {
  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {step1 && (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {!step1 && (
              <Nav.Link disabled as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {step2 && (
              <Nav.Link as={Link} to="/shipping">
                Shipping
              </Nav.Link>
            )}
            {!step2 && (
              <Nav.Link disabled as={Link} to="/shipping">
                Shipping
              </Nav.Link>
            )}
            {step3 && (
              <Nav.Link as={Link} to="/payment">
                Payment
              </Nav.Link>
            )}
            {!step3 && (
              <Nav.Link disabled as={Link} to="/payment">
                Payment
              </Nav.Link>
            )}
            {step4 && (
              <Nav.Link as={Link} to="/placeorder">
                Place Order
              </Nav.Link>
            )}
            {!step4 && (
              <Nav.Link disabled as={Link} to="/placeorder">
                Place Order
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CheckoutStep;
