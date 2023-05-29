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
import { listOrders } from "../actions/orderActions";

function OrderListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const orderList = useSelector(state => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  

  useEffect(() => {
    if (userInfo && userInfo.isAdmin){
      dispatch(listOrders());
    } else {
      navigate('/');
    }
    
  }, [dispatch, location, userInfo]);

  return (
    <div>
      <h1>Orders</h1>
      {loading && <Loader />}
      {!loading && error && <Message variant="danger">{error}</Message>}
      {!loading && !error && (
        <Table striped bordeered hover responsive className="table-sm">
          <thead>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL PRICE</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0,10)
                  ) : (
                    <i className="fas fa-check" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelievered ? (
                    order.deliveredAt.substring(0,10)
                  ) : (
                    <i className="fas fa-check" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <Button
                    className="btn-block"
                    as={Link}
                    to={`/order/${order._id}`}
                  >
                    Details
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

export default OrderListScreen;
