import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/product";
import { useDispatch, useSelector } from "react-redux";
// import { listProducts } from "../actions/productActions";
import Loader from "../components/loader";
import Message from "../components/message";
import { listProducts } from "../actions/productActions";
import { useSearchParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";

function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList); 
  const { error, loading, products, page, pages } = productList;

  const [searchParams, setSearchParams] = useSearchParams();

  let keyword = searchParams.get('keyword') === null ? '' : searchParams.get('keyword')

  let currPage = searchParams.get('page') === null ? 1 : searchParams.get('page')

  useEffect(() => {
    dispatch(listProducts(keyword, currPage))
  }, [dispatch, keyword])



  return (
    <div>
      {!keyword && <ProductCarousel/>}
      <h1>Latest Products</h1>

      {loading && <Loader></Loader>}
      {!loading && error && <Message variant='danger'>{error}</Message>}
      {!loading && !error && (
        <>
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product}></Product>
            </Col>
          ))}
        </Row>
        <Paginate page={page} pages = {pages} keyword={keyword}/>
        </>
      )}
    </div>
  );
}

export default HomeScreen;
