import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { logout } from "../actions/userActions";
import SearchBox from "./SearchBox";

function MyNavbar() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          ProShop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <SearchBox></SearchBox>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/cart">
              <i className="fas fa-shopping-cart"></i>Cart
            </Nav.Link>
            {!userInfo && (
              <Nav.Link as={Link} to="/login">
                <i className="fas fa-user"></i>Login
              </Nav.Link>
            )}
            {userInfo && (
              <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Button} onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {userInfo && userInfo.isAdmin &&  (
              <NavDropdown title="Admin" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/admin/userList">
                  Users
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/productList">
                  Products
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/orderList">
                  Orders
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
