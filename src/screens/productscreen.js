import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import Rating from "../components/rating";
import Loader from "../components/loader";
import Message from "../components/message";

import { listProductDetails, createProductReview } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

function ProductScreen() {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { loading: loadingProductReview, error:errorProductReview, success: successProductReview  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductDetails(params.id));
  }, [dispatch, params, successProductReview]);

  const addToCartHandler = () => {
    navigate(`/cart/${params.id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(params.id, {rating, comment}))
  }

  return (
    <div>
      <Link to={"/"} className="btn btn-light my-3">
        Home
      </Link>
      {loading && <Loader></Loader>}
      {!loading && error && <Message variant="danger">{error}</Message>}
      {!loading && !error && (
        <div>
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid></Image>
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>{product.name}</h4>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                ></Rating>
              </ListGroup.Item>

              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>

              <ListGroup.Item>
                Descriptions: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price : </Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status: </Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty: </Col>
                      <Col xs='auto' className='my-2'>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {
                            [...Array(product.countInStock).keys()].map(x => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))
                          }
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    onClick={addToCartHandler}
                    variant="dark"
                    disabled={product.countInStock === 0}
                    size="lg"
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h4>Reviews</h4>
            {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

            <ListGroup varaint='flush'>
              {product.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} color='yellow'></Rating>
                  <p>{review.createdAt}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h4>Write a review</h4>
                {userInfo && (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId='rating'>
                      <Form.Label>Rating</Form.Label>
                      <Form.Control as='select' value={rating} onChange = {e => setRating(e.target.value)}>
                        <option value=''>Select....</option>
                        <option value='1'>1 - Poor</option>
                        <option value='2'>2 - Fair</option>
                        <option value='3'>3 - Good</option>
                        <option value='4'>4 - Very Good</option>
                        <option value='5'>5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='comment'>
                      <Form.Label>Review</Form.Label>
                      <Form.Control as='textarea' row='5' value={comment} onChange={e => setComment(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Button disabled={loadingProductReview} type='submit' variant='primary'>Submit Review</Button>
                  </Form>
                )}
                {!userInfo && (<Message variant='info'>Please <Link to='/login'>login</Link></Message>)}
              </ListGroup.Item>
            </ListGroup>
          </Col>        
        </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
