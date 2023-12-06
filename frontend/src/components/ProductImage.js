
import React from "react";
import { Col, Card } from 'react-bootstrap';

const ProductImage = ({ productName }) => (
    <Col md={8} className="d-flex justify-content-center align-items-center" style={{ maxHeight: "300px", backgroundColor: "#f5f5f5" }}>
        <Card.Img
            src={"https://pbs.twimg.com/profile_images/1717341619022647296/LSacqmFf_400x400.jpg"}
            alt={productName}
            className="img-fluid"
            style={{ maxHeight: "100%", width: "100%", objectFit: "contain" }}
        />
    </Col>
);

export default ProductImage;
