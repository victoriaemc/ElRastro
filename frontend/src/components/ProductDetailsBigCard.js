// ProductDetailsBigCard.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Row } from 'react-bootstrap';
import ProductImage from "./ProductImage";
import BidDetails from "./BidDetails";
import ProductDetails from "./ProductDetails";

const ProductDetailsBigCard = () => {
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
                    <Card.Body>
                        <Row style={{maxHeight: '300px'}}>
                            <ProductImage productName={product.name} />
                            <BidDetails lastBid={product.lastBid} endingDate={product.endingDate} />
                        </Row>
                        <ProductDetails productName={product.name} productDescription={product.description} />
                    </Card.Body>
                </Card>
            </div>
        </section>
    );
}

export default ProductDetailsBigCard;
