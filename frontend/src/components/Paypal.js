import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import ProductDetails from "./ProductDetails";
import CloudinaryImage from "./CloudinaryImage";
import PaypalButton from "./PaypalButton";

const Paypal = () => {
    const { productId } = useParams();

    const [product, setProduct] = useState({});
    const [sellerUser, setSellerUser] = useState({});
    const [show, setShow] = useState(false);

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

    // El bloque adicional fue eliminado

    if (!product || Object.keys(product).length === 0) {
        return <p>Cargando...</p>;
    }

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <section className="section-content padding-y bg">
            <div className="container">
                <Card className="mx-auto my-4">
                    <Card.Body>
                        <Row>
                            <h2>Precio a pagar:</h2>
                        </Row>
                        <Row>
                            <h3>{product.lastBid} euros</h3>
                        </Row>
                        <Row>
                            <PaypalButton amount={product.lastBid} />
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        </section>
    );
}

export default Paypal;
