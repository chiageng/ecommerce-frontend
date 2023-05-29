import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

function SearchBox() {
  const params = useParams();

  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/?keyword=${keyword}&page=1`)
    } else {
      navigate`/?`
    }
  };
  return (
    <Form onSubmit={submitHandler}>
      <Row>
        <Col md={8}>
          <Form.Control
            type="text"
            name="q"
            onChange={(e) => setKeyword(e.target.value)}
            className="mr-sm-2 ml-sm-5"
          ></Form.Control>
        </Col>
        <Col md={1}>
          <Button type="submit" variant="outline-success" className="p-2">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBox;
