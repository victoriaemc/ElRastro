import { Card, Row, Col } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import CloudinaryImage from "./CloudinaryImage";

const ChatPreview = ({ productId, lastMessage }) => {
    const [product, setProduct] = useState({});

    useEffect(() => {
        async function getProduct() {
            try {
                const response = await fetch(`${process.env.REACT_APP_GATEWAY}/${productId}`);
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

    return (
        <Card className="mx-auto my-4">
            <Card.Body>
                <Row style={{ maxHeight: '300px' }}>
                    <Col md={3}>
                        <div style={{
                            width: '100px', // Ajusta el tamaño según sea necesario
                            height: '100px', // Ajusta el tamaño según sea necesario
                            borderRadius: '50%', // Hace que la imagen tenga forma de círculo
                            overflow: 'hidden', // Evita que la imagen se desborde del círculo
                        }}>
                            <img
                                src={CloudinaryImage(product.imageId)}
                                className="productDetailImg"
                                alt="Image"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </Col>
                    <Col md={9}>
                        <Row>
                            <strong>{product.name}</strong>
                        </Row>
                        <Row>
                            {lastMessage}
                        </Row>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default ChatPreview;
