import React, { useState } from "react";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
const CreateProductForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startingPrice: 0.0,
        latitude: '',
        longitude: '',
        endingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set user ID and publication date
        formData.user = '6550a4a5fadb65a38330bff9';
        formData.publicationDate = new Date().toISOString();
        formData.finished = false;

        try {
            // Make a POST request to your API endpoint to save the new product
            await axios.post('http://localhost:8000/', formData);
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

return (
    <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter product name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
            />
        </Form.Group>

        <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
            />
        </Form.Group>

        <Form.Group controlId="formStartingPrice">
            <Form.Label>Starting Price</Form.Label>
            <InputGroup style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
                <Form.Control
                    type="number"
                    placeholder="Enter starting price"
                    name="startingPrice"
                    value={formData.startingPrice}
                    onChange={handleChange}
                    required
                />
                <InputGroup.Text id="basic-addon2">€</InputGroup.Text>
            </InputGroup>
        </Form.Group>

        <Form.Group controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Row style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Enter latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        required
                    />
                </Col>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Enter longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        required
                    />
                </Col>
            </Row>
        </Form.Group>

        <Form.Group controlId="formEndingDate">
            <Form.Label>Ending Date</Form.Label>
            <Form.Control
                type="date"
                name="endingDate"
                value={formData.endingDate}
                onChange={handleChange}
                required
                style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)', marginBottom: '10px' }}
            />
        </Form.Group>

        <CloudinaryUploadWidget style={{ marginTop: '10px', marginBottom: '10px' }}/>

        <Form.Group controlId="formSubmit">
            <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                Submit
            </Button>
        </Form.Group>
    </Form>
);
};

export default CreateProductForm;
