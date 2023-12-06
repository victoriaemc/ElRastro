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
        <ElRastroNavbar expand="sm" className="bg-body-tertiary justify-content-between">
        <ElRastroNavbar.Brand href="/" className="ml-sm-2">El Rastro</ElRastroNavbar.Brand>
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
                <Button variant="primary">Nuevo Producto</Button>
            </Col>
            <Col xs="auto">
                <Button variant="primary">Mis pujas</Button>
            </Col>
            <Col xs="auto" >
                <Button variant="outline-primary">Perfil</Button>
            </Col>
            <Col xs="auto">
                <Link to="/login">
                    <Button variant="outline-primary">Iniciar Sesion</Button>
                </Link>
            </Col>
        </Row>
    </ElRastroNavbar>
        </Container>);
};