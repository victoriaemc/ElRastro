import React,{useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';


export default function Header(){
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
                <Button variant="primary">Nuevo Producto</Button>
            </Col>
            <Col xs="auto" >
                <Button variant="outline-primary">Perfil</Button>
            </Col>
        </Row>
    </Navbar>
        </Container>);
};