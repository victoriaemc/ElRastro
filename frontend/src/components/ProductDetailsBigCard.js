// ProductDetailsBigCard.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {Card, Row, Col, Button} from 'react-bootstrap';
import ProductImage from "./ProductImage";
import BidDetails from "./BidDetails";
import ProductDetails from "./ProductDetails";
import Countdown from "./Countdown";
import ProductLocation from "./ProductLocation";
import CloudinaryImage from "./CloudinaryImage";

const ProductDetailsBigCard = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("ProductId");

    const [product, setProduct] = useState({});
    const [sellerUser, setSellerUser] = useState({});

    useEffect(() => {
        async function getProduct() {
            try {
                const response = await fetch(`http://localhost:8000/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const product = await response.json();
                setProduct(product);
                // Call getSellerUsername with the user ID after setting the product
                getSellerUsername(product.user);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        }

        getProduct();


    }, [productId]);

    async function getSellerUsername(userId) {
        try {
            const response = await fetch(`http://localhost:8000/users/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const user = await response.json();
            setSellerUser(user);
        } catch (error) {
            console.error('Error fetching seller:', error);
        }
    }


    if (!product || Object.keys(product).length === 0) {
        return <p>Cargando...</p>;
    }

    return (
        <section className="section-content padding-y bg">
            <div className="container">
                <Card className="mx-auto my-4">
                    <Card.Body>
                        <Row style={{maxHeight: '300px'}}>
                            <Col md={8} className="d-flex justify-content-center align-items-center" style={{ maxHeight: "300px", backgroundColor: "#f5f5f5" }}>
{/*                                 <ProductImage productName={product.name} />
 */}                            
                                <img src={CloudinaryImage(product.imageId)} />
                            </Col>
                            <Col md={4}>
                                <BidDetails lastBid={product.lastBid} endingDate={product.endingDate} productId={productId}/>
                                <Countdown lastBid={product.lastBid} endingDate={product.endingDate} />
                            </Col>
                        </Row>
                        <ProductDetails productName={product.name} productDescription={product.description} />
                        <Row>
                            <Col>
                                <p><b>Vendido por:</b>  {sellerUser ?  <a href={`/userProfile/${sellerUser._id}`}>{sellerUser.username}</a> : "Cargando..."}</p>

                            </Col>
                            <Col>
                                <Button variant="secondary">Chat con el vendedor</Button>
                            </Col>
                        </Row>

                    </Card.Body>
                </Card>
                <Card className="mx-auto my-4">
                    <ProductLocation latitude={product.latitude} longitude={product.longitude} />
                </Card>
            </div>
        </section>
    );
}

export default ProductDetailsBigCard;
