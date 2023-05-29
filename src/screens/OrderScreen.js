import React, { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  Image,
  Card,
  ListGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../actions/cartActions";
import Loader from "../components/loader";
import Message from "../components/message";
import FormContainer from "../components/FormContainer";
import { deliverOrder, getOrderDetails, payOrder } from "../actions/orderActions";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ORDER_PAY_RESET,ORDER_DELIVER_RESET  } from "../constants/orderConstants";

function OrderScreen() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [sdkReady, setSdkReady] = useState(false);

  const orderId = params.id;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;


  if (!loading && !error) {
    order.itemsPrice = Number(
      order.orderItems
        .reduce((acc, item) => acc + item.price * item.qty, 0)
        .toFixed(2)
    );
  }

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=ATWvFRkjTkHrVyom1rZi6_tIPxty6hOgY-dOGTyasZbCKT9XBKrjAdEbyYYy3nzApb5UfLSU6bqZ5Rkh&components=buttons";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!order || order._id !== Number(orderId) || successDeliver) {
      dispatch({type: ORDER_PAY_RESET});
      dispatch({type: ORDER_DELIVER_RESET})
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return (
    <PayPalScriptProvider options={{ "client-id": "ATWvFRkjTkHrVyom1rZi6_tIPxty6hOgY-dOGTyasZbCKT9XBKrjAdEbyYYy3nzApb5UfLSU6bqZ5Rkh" }}>
      {loading && <Loader></Loader>}
      {!loading && error && <Message variant="danger">{error}</Message>}
      {!loading && !error && (
        <Row>
          <h1>Order: {order._id} </h1>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>{" "}
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </p>
                <p>
                  <strong>Shipping: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city},
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>

                {order.isDelivered && (
                  <Message variant="success">
                    Delivered on {order.deliveredAt}
                  </Message>
                )}
                {!order.isDelivered && (
                  <Message variant="warning">Not Delivered</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Payment Method: </strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid && (
                  <Message variant="success">Paid on {order.paidAt}</Message>
                )}
                {!order.isPaid && <Message variant="warning">Not Paid</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.length === 0 && (
                  <Message variant="info">Your order is empty</Message>
                )}
                {order.orderItems.length > 0 && (
                  <ListGroup variant="flush">
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={2}>
                            <Image
                              src={item.image}
                              fluid
                              rounded
                              alt={item.name}
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} X $ {item.price} = $
                            {(item.qty * item.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Item : </Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping : </Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax : </Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total : </Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>

                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader/>}
                    {!sdkReady && <Loader/>}
                    {sdkReady && <PayPalButtons createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: order.totalPrice,
                                },
                            },
                        ],
                    });
                }}
                onApprove={successPaymentHandler}/>}
                  </ListGroup.Item>
                )}
              </ListGroup>

              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type='button' className='btn btn-block' onClick={deliverHandler}>Mark as Deliver</Button>
                </ListGroup.Item>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </PayPalScriptProvider>
  );
}

export default OrderScreen;
