import React from "react";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

function Paginate({ pages, page, keyword = "", isAdmin = false }) {

  return (
    <Pagination>
      {[...Array(pages).keys()].map((x) => (
        <Pagination.Item
          key={x + 1}
          href= {isAdmin? `/admin/productList/?page=${x + 1}` :`/?keyword=${keyword}&page=${x + 1}`}
          active={x + 1 === page}
        >
          {x + 1}
        </Pagination.Item>  
      ))}
    </Pagination>
  );
}

export default Paginate;
