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
import CheckoutStep from "../components/CheckoutStep";
import Message from "../components/message";
import FormContainer from "../components/FormContainer";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { CART_CLEAR_ITEM } from "../constants/cartConstants";

function PlaceOrderScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const orderCreate = useSelector(state => state.orderCreate);
  const { order, error, success } = orderCreate;

  cart.itemsPrice = Number(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2));
  cart.shippingPrice = Number(cart.itemsPrice > 100 ? 0 : 10.00);
  cart.taxPrice = Number((cart.itemsPrice * 0.08).toFixed(2))
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  if (!cart.paymentMethod) {
    navigate('/payment')
  }

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`)
      dispatch({type: ORDER_CREATE_RESET})
      dispatch({type: CART_CLEAR_ITEM})
      
      localStorage.removeItem('cartItems')
    }
  }, [success, location])

  const placeOrder = () => {
    dispatch(createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    }))
  }

  return (
    <>
      <FormContainer>
        <CheckoutStep step1 step2 step3 step4></CheckoutStep>
      </FormContainer>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Shipping: </strong>
                {shippingAddress.address}, {shippingAddress.city},
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Payment Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 && (
                <Message variant="info">Your cart is empty</Message>
              )}
              {cart.cartItems.length > 0 && (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
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
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping : </Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax : </Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total : </Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
            
              <ListGroup.Item>
                {error && <Message varaint='danger'>{error}</Message>}
              </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cart.cartItems.length === 0}
                onClick={placeOrder}
              >
                Place Order
              </Button>
            </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default PlaceOrderScreen;
