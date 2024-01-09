import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import ProductDetails from "./ProductDetails";
import CloudinaryImage from "./CloudinaryImage";

const ProductToBuy = () => {
    const { productId } = useParams();

    const [product, setProduct] = useState({});
    const [sellerUser, setSellerUser] = useState({});
    const [show, setShow] = useState(false);

    useEffect(() => {
        async function getProduct() {
            try {
                const response = await fetch(process.env.REACT_APP_GATEWAY+`/${productId}`);
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
            const response = await fetch(process.env.REACT_APP_GATEWAY+`/users/${userId}`);
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

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <section className="section-content padding-y bg">
            <div className="container">
                <Card className="mx-auto my-4">
                    <Card.Body>
                        <Row style={{maxHeight: '300px'}}>
                            <Col className="d-flex justify-content-center align-items-center" style={{ maxHeight: "300px", backgroundColor: "#f5f5f5" }}>
                                {/*                                 <ProductImage productName={product.name} />
 */}
                                <img src={CloudinaryImage(product.imageId)} className="productDetailImg" alt={"Image"}/>
                            </Col>
                        </Row>
                        <ProductDetails productName={product.name} productDescription={product.description} />
                        <Row>
                            <Col>
                                <p><b>Vendido por:</b>  {sellerUser ?  <a href={`/userProfile/${sellerUser._id}`}>{sellerUser.username}</a> : "Cargando..."}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>

        </section>
    );

}

export default ProductToBuy;