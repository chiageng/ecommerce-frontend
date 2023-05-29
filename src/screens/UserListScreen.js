import React, { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import Loader from "../components/loader";
import Message from "../components/message";
import { listUsers } from "../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../actions/userActions";

function UserListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin 

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  

  useEffect(() => {
    if (userInfo && userInfo.isAdmin){
      dispatch(listUsers());
    } else {
      navigate('/');
    }
    
  }, [dispatch, location, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')){
      dispatch(deleteUser(id))
    }
  }
  return (
    <div>
      <h1>Users</h1>
      {loading && <Loader />}
      {!loading && error && <Message variant="danger">{error}</Message>}
      {!loading && !error && (
        <Table striped bordeered hover responsive className="table-sm">
          <thead>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th></th>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-check" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <Button
                    className="btn-block"
                    as={Link}
                    to={`/admin/user/${user._id}`}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    className="btn-block"
                    variant='danger'
                    as={Link}
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default UserListScreen;
