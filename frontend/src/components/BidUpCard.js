import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Row, Col } from 'react-bootstrap';
import ProductImage from "./ProductImage";
import BidDetailsWithoutButton from "./BidDetailsWithoutButton";
import ProductDetails from "./ProductDetails";
import Countdown from "./Countdown";
import SubmitBid from "./SubmitBid";

const BidUpCard = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("ProductId");

    const [product, setProduct] = useState({});

    useEffect(() => {
        async function getProduct() {
            try {
                const response = await fetch(`http://localhost:8000/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const product = await response.json();
                setProduct(product);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        }

        getProduct();
    }, [productId]);

    if (!product || Object.keys(product).length === 0) {
        return <p>Cargando...</p>;
    }

    return (

        <section className="section-content padding-y bg">
            <div className="container">
                <Card className="mx-auto my-4">
                    <Card.Title className="mt-4">Pujar por {product.name}</Card.Title>
                    <hr />
                    <Card.Body>
                        <Row style={{maxHeight: '300px'}}>
                            <Col className="d-flex justify-content-center align-items-center" style={{ maxHeight: "300px", backgroundColor: "#f5f5f5" }}>
                                <ProductImage productName={product.name} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <BidDetailsWithoutButton lastBid={product.lastBid} endingDate={product.endingDate} />
                            </Col>
                            <Col md={6}>
                                <Countdown lastBid={product.lastBid} endingDate={product.endingDate} />
                            </Col>
                        </Row>
                        <Row>
                            <SubmitBid product={product} endingDate={product.endingDate}/>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        </section>
    )
}

export default BidUpCard;