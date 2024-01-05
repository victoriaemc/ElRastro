import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row } from 'react-bootstrap';
import PaypalButton from './PaypalButton';

const Paypal = () => {
    const { productId } = useParams();

    const [product, setProduct] = useState({});
    const [highestBid, setHighestBid] = useState({});
    const [amount, setAmount] = useState(0);
    const [payed, setPayed] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch product details
                const productResponse = await fetch(`http://localhost:8000/${productId}`);
                if (!productResponse.ok) {
                    throw new Error(`HTTP error! Status: ${productResponse.status}`);
                }
                const productData = await productResponse.json();
                setProduct(productData);

                setAmount(productData.lastBid.toFixed(2));
                setPayed(productData.payed);
                payed = productData.payed;

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [productId]);

    if (!product || Object.keys(product).length === 0) {
        return <p>Cargando...</p>;
    }

    return (
        <section className="section-content padding-y bg">
            <div className="container">
                <Card className="mx-auto my-4">
                    <Card.Body>
                        <Row>
                            <h2>Precio a pagar:</h2>
                        </Row>
                        <Row>
                            <h3>{product.lastBid}</h3>
                        </Row>
                        <Row>
                            <PaypalButton amount={parseFloat(amount)} payed={payed} productId={productId}/>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        </section>
    );
};

export default Paypal;
