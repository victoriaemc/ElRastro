import React, { useState } from "react";
import { Col, Row, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import InputGroup from "react-bootstrap/InputGroup";

const SubmitBid = ({ product, endingDate }) => {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState(null);

    const provisionalUserId = "65720e41e0700cc1b8534119";
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("ProductId");
    const handleSubmit = (event) => {
        event.preventDefault();

        // Validar condiciones
        const currentDate = new Date();
        const currentTimestamp = currentDate.getTime();

        if (Number(amount) <= Number(product.lastBid)) {
            setError("La cantidad debe ser mayor a la puja más alta.");
        } else if (Number(amount) <= Number(product.startingPrice)) {
            setError("La cantidad debe ser mayor al precio inicial.");
        } else if (currentTimestamp >= endingDate) {
            setError("Esta subasta ya ha finalizado.");
        } else {
            // Lógica para manejar la presentación de la puja
            // ...

            axios.put(process.env.REACT_APP_GATEWAY+`/${productId}`, {
                name: product.name,
                description: product.description,
                user: product.user,
                startingPrice: product.startingPrice,
                lastBid: Number(amount),
                latitude: product.latitude,
                longitude: product.longitude,
                publicationDate: product.publicationDate,
                endingDate: product.endingDate,
                finished: product.finished,
                imageId: product.imageId
            })
                .then(response => {
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error al actualizar el producto:', error);
                    setError("Error al realizar la puja. Inténtalo de nuevo.");
                });

            axios.post(`http://localhost:8000/bids`, {
                product: productId,
                user: provisionalUserId,
                price: Number(amount),
                date: currentTimestamp
            })
                .then(response => {
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error al actualizar el producto:', error);
                    setError("Error al realizar la puja. Inténtalo de nuevo.");
                });

            setError(null); // Reiniciar el mensaje de error si la validación es exitosa

        }
    };

    return (
        <Form onSubmit={handleSubmit} className="d-flex align-items-center">

            <Row>
                <div className="mb-2 p-2 border rounded d-flex flex-column justify-content-center mx-auto" style={{ width: "100%"}}>

                    <Col>
                        <Form.Group controlId="bidAmount" className="flex-grow-1 mr-2">
                            <InputGroup>
                            <Form.Control
                                type="number"
                                placeholder="Ingrese la cantidad"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                                <InputGroup.Text id="basic-addon2">€</InputGroup.Text>
                        </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit">
                            Realizar Puja
                        </Button>
                    </Col>
                </div>

            </Row>
            <br/>
            <Row>
                {error && <Alert variant="danger">{error}</Alert>}
            </Row>

        </Form>
    );
};

export default SubmitBid;
