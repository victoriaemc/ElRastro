import React from "react";
import { Col, Row, Card } from 'react-bootstrap';

const ProductDetails = ({ productName, productDescription }) => (
    <Row>
        <Col md={12}>
            <Card.Title className="mt-4">{productName}</Card.Title>
            <hr />
            <Card.Text>{productDescription}</Card.Text>
        </Col>
    </Row>
);

export default ProductDetails;
