import React from "react";
import ProductToBuy from "../components/ProductToBuy";
import Paypal from "../components/Paypal"
import { Row, Col } from 'react-bootstrap';

export default function PaymentPage(){
    return (
        <div>
            <h1>Pagar producto</h1>
            <Row style={{maxHeight: '300px'}}>
                <Col md={8}>
                    <ProductToBuy/>
                </Col>
                <Col md={4}>
                    <Paypal/>
                </Col>
            </Row>
        </div>
    )
}