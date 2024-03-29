// ProductDetailsFinishedBigCard.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {Card, Row, Col, Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import ProductImage from "./ProductImage";
import BidDetails from "./BidDetails";
import ProductDetails from "./ProductDetails";
import Countdown from "./Countdown";
import ProductLocation from "./ProductLocation";
import CloudinaryImage from "./CloudinaryImage";
import StarRatings from "react-star-ratings";
import axios from "axios";

const ProductDetailsFinishedBigCard = ({user}) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("ProductId");

    const [product, setProduct] = useState({});
    const [sellerUser, setSellerUser] = useState({});
    const [show, setShow] = useState(false);
    const [rater, setRater] = useState('');
    const [rating, setRating] = useState(0.0);

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
    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };


    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        setRater('654fc829545069d773dc1fdd');
        const ratingObject = {
            rating: rating,
            product: productId,
            user: sellerUser._id,
            rater: rater
        };


        try {
            // Make a POST request to your API endpoint to save the new rating
            await axios.post(process.env.REACT_APP_GATEWAY+`/users/${sellerUser._id}/ratings`, ratingObject);
            handleClose();
        }catch (error) {
            console.error('Error creating rating:', error);
        }

    };

    return (
        <section className="section-content padding-y bg">
            <div className="container">
                <Card className="mx-auto my-4">
                    <Card.Body>
                        <Row style={{maxHeight: '300px'}}>
                            <Col md={8} className="d-flex justify-content-center align-items-center" style={{ maxHeight: "300px", backgroundColor: "#f5f5f5" }}>
                                {/*                                 <ProductImage productName={product.name} />
 */}
                                <img src={CloudinaryImage(product.imageId)} className="productDetailImg" alt={"Image"}/>
                            </Col>
                            <Col md={4}>
                                <Countdown lastBid={product.lastBid} endingDate={product.endingDate} />
                            </Col>
                        </Row>
                        <ProductDetails productName={product.name} productDescription={product.description} />
                        <Row>
                            <Col>
                                <p><b>Vendido por:</b>  {sellerUser ?  <a href={`/userProfile/${sellerUser._id}`}>{sellerUser.username}</a> : "Cargando..."}</p>

                            </Col>
                            {(user == null || sellerUser._id != user._id) ? (
                                <>
                                    <Col>
                                        <Button variant="secondary" href={`/chat/${productId}`}>Chat con el vendedor</Button>
                                    </Col>
                                    <Col>
                                        <Button variant="secondary" onClick={handleShow}>Valorar vendedor</Button>
                                    </Col>
                                </>
                            ) : (
                                <Col>
                                    <Button variant="secondary" href={`/editProduct/${productId}`}>Editar este producto</Button>
                                </Col>
                            )}

                        </Row>

                    </Card.Body>
                </Card>
                <Card className="mx-auto my-4">
                    <ProductLocation latitude={product.latitude} longitude={product.longitude} />
                </Card>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Valorar vendedor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Desea valorar al vendedor{" "}
                    {sellerUser ? (
                        <a href={`/userProfile/${sellerUser._id}`}>{sellerUser.username}</a>
                    ) : (
                        "Cargando..."
                    )}
                    ?
                    <div className="my-3">
                        <StarRatings
                            rating={rating}
                            starRatedColor="gold"
                            starHoverColor="gold"
                            changeRating={handleRatingChange}
                            numberOfStars={5}
                            starDimension="30px"
                            starSpacing="5px"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleRatingSubmit}>
                        Valorar
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
}

export default ProductDetailsFinishedBigCard;
