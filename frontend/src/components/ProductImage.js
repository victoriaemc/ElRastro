
import React from "react";
import { Col, Card } from 'react-bootstrap';

const ProductImage = ({ productName }) => (
    <Card.Img
        src={"https://pbs.twimg.com/profile_images/1717341619022647296/LSacqmFf_400x400.jpg"}
        alt={productName}
        className="img-fluid"
        style={{ maxHeight: "100%", width: "100%", objectFit: "contain" }}
    />
);

export default ProductImage;
