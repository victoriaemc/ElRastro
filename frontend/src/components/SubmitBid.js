import React, { useState } from "react";
import { Col, Row, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from "react-router-dom";

const SubmitBid = ({ product, endingDate }) => {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState(null);

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
        } else if (currentTimestamp >= endingDate) {
            setError("Esta subasta ya ha finalizado.");
        } else {
            // Lógica para manejar la presentación de la puja
            // ...

            console.log(productId);
            axios.put(`http://localhost:8000/${productId}`, {
                name: product.name,
                description: product.description,
                user: product.user,
                startingPrice: product.startingPrice,
                lastBid: Number(amount),
                latitude: product.latitude,
                longitude: product.longitude,
                publicationDate: product.publicationDate,
                endingDate: product.endingDate,
                finished: product.finished
            })
                .then(response => {
                    console.log('Actualización exitosa:', response.data);
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
                <div className="mb-2 p-2 border rounded d-flex flex-column justify-content-center" style={{ width: "100%" }}>

                    <Col>
                        <Form.Group controlId="bidAmount" className="flex-grow-1 mr-2">
                            <Form.Control
                                type="number"
                                placeholder="Ingrese la cantidad"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
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
