import React,{useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import {Link} from 'react-router-dom';


export default function ElRastroNavbar(){
    return (
        <Container fluid>
        <Navbar expand="sm" className="bg-body-tertiary justify-content-between">
        <Navbar.Brand href="/" className="ml-sm-2">El Rastro</Navbar.Brand>
        <Form inline>
            <Row>
                <Col xs="auto">
                    <Form.Control
                        type="text"
                        placeholder="Search"
                        className=" mr-sm-2"
                    />
                </Col>
                <Col xs="auto">
                    <Button type="submit">Submit</Button>
                </Col>
            </Row>
        </Form>
        <Row className="mr-sm-2">
            <Col xs="auto">
                {/* Link the "Nuevo Producto" button to the CreateProduct page */}
                <Link to="/createProduct">
                    <Button variant="primary">Nuevo Producto</Button>
                </Link>
            </Col>
            <Col xs="auto">
                <Button variant="primary">Mis pujas</Button>
            </Col>
            <Col xs="auto" >
                <Link to="/userProfile/6550a4a5fadb65a38330bff9">
                    <Button variant="outline-primary">Perfil</Button>
                </Link>
            </Col>
            <Col xs="auto">
                <Link to="/login">
                    <Button variant="outline-primary">Iniciar Sesion</Button>
                </Link>
            </Col>
        </Row>
    </Navbar>
        </Container>);
};