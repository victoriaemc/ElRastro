import React, { useState } from "react";
import { Col, Row, Card, Form, Button, Alert } from 'react-bootstrap';

const SubmitBid = ({ product, endingDate }) => {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState(null);

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
