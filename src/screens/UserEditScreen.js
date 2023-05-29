import React, { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Loader from "../components/loader";
import Message from "../components/message";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, register, updateUser } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import { USER_UPDATE_RESET } from "../constants/userConstants";


function UserEditScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const userId = params.id;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;

  const userUpdate = useSelector(state => state.userUpdate)
  const {error: errorUpdate, loading: loadingUpdate, success: successUpdate} = userUpdate


  useEffect(() => {
    if (successUpdate) {
      dispatch({type: USER_UPDATE_RESET})
      navigate('/admin/userlist')
    } else{
      if (!user || user._id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }

  }, [user, userId, dispatch, successUpdate, location]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({_id: user._id, name, email, isAdmin}))
  };
  return (
    <FormContainer>
      <h1>Edit User</h1>
      <Link to='/admin/userlist'>Go back </Link>
      {loading && <Loader></Loader>}
      {!loading && error && <Message varaint="da  r">{error}</Message>}
      {loadingUpdate && <Loader/>}
      {!loadingUpdate && errorUpdate && <Message varaint="da  r">{errorUpdate}</Message>}
      {!loading && !error && (
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="isadmin">
          <Form.Label>Is Admin</Form.Label>
          <Form.Check
            type="checkbox"
            label="Is Admin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          ></Form.Check>
        </Form.Group>
 
        <Button type="submit" variant="primary">
          Update
        </Button>
      </Form>
      )}

    </FormContainer>
  );
}

export default UserEditScreen;
