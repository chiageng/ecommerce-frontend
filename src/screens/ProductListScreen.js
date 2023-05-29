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
import { listProducts } from "../actions/productActions";
import { deleteProduct, createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import Paginate from "../components/Paginate";

function ProductListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const productList = useSelector(state => state.productList)
  const { error, loading, products, page, pages } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector(state => state.productDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = productDelete

  const productCreate = useSelector(state => state.productCreate);
  const { loading: loadingCreate, success: successCreate, error: errorCreate, product: createdProduct } = productCreate
  
  let currPage = searchParams.get('page') === null ? 1 : searchParams.get('page')


  useEffect(() => {
 
    if (!userInfo.isAdmin) {
      navigate('/');
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
      console.log(createdProduct._id)
      dispatch({type: PRODUCT_CREATE_RESET})
    } else {
      dispatch(listProducts('', currPage))
    }
    
  }, [dispatch, location, userInfo, successDelete, successCreate, createdProduct]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')){
     dispatch(deleteProduct(id));
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }
  return (
    <div>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader/>}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {loadingCreate && <Loader/>}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

      {loading && <Loader />}
      {!loading && error && <Message variant="danger">{error}</Message>}
      {!loading && !error && (
        <Table striped bordeered hover responsive className="table-sm">
          <thead>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
            <th></th>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <Button
                    className="btn-block"
                    as={Link}
                    to={`/admin/product/${product._id}/edit`}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    className="btn-block"
                    variant='danger'
                    as={Link}
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
       <Paginate page={page} pages = {pages} keyword="" isAdmin={true}/>
    </div>
  );
}

export default ProductListScreen;
