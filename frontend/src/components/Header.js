import React,{useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Header(){
    return (<Navbar expand="sm" className="bg-body-tertiary justify-content-between">
        <Navbar.Brand href="/">El Rastro</Navbar.Brand>
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
        <Navbar.Brand href="/">Login y eso</Navbar.Brand>
    </Navbar>);
};