import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { Link, useNavigate } from 'react-router-dom';

export default function ElRastroNavbar({user}) {
    const [searchTerm, setSearchTerm] = useState('');
    const history = useNavigate();
    console.log("User prop: ", user);

    const handleSearch = (e) => {
        e.preventDefault();
        // Construye la URL de búsqueda y realiza la redirección
        const searchUrl = `/search/${searchTerm}`;
        history(searchUrl);
    };

    return (
        <Container fluid>
            <Navbar expand="sm" className="bg-body-tertiary justify-content-between">
                <Navbar.Brand href="/" className="ml-sm-2">
                    El Rastro
                </Navbar.Brand>
                <Form inline>
                    <Row>
                        <Col xs="auto">
                            <Form.Control
                                type="text"
                                placeholder="Search"
                                className="mr-sm-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Col>
                        <Col xs="auto">
                            <Button type="submit" onClick={handleSearch}>
                                Submit
                            </Button>
                        </Col>
                        <Col xs="auto">

                            {user ? (
                                <Navbar.Text className="d-inline-block text-truncate">{user.name}</Navbar.Text>
                            ):(
                                <Navbar.Text className="d-inline-block text-truncate">Not logged in</Navbar.Text>
                            )}
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
                        <Link to="/myBids/65720e41e0700cc1b8534119">
                            <Button variant="primary">Mis pujas</Button>
                        </Link>
                    </Col>
                    <Col xs="auto">
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
        </Container>
    );
}
