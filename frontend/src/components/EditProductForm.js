import React, {useEffect, useState} from "react";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const EditProductForm = ({productId}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startingPrice: 0.0,
        latitude: '',
        longitude: '',
        endingDate: new Date(Date.now()).toISOString().split('T')[0],
    });
    const [endNowClicked, setEndNowClicked] = useState(false);


    useEffect(() => {
        // Fetch existing product details using id from useParams and set the form state
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/${id}`);
                const existingProduct = response.data;
                console.log(existingProduct.endingDate);
                setFormData({
                    name: existingProduct.name,
                    description: existingProduct.description,
                    startingPrice: existingProduct.startingPrice,
                    latitude: existingProduct.latitude,
                    longitude: existingProduct.longitude,
                    endingDate: existingProduct.endingDate
                });
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails().then(r => console.log("Product details fetched"));
    }, [id]); // Use id instead of productId

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make a PUT request to update the existing product
            await axios.put(`http://localhost:8000/${id}`, formData);
            navigate(-1);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    function handleEndNowClick() {
        setEndNowClicked(true);
        setFormData({
            ...formData,
            endingDate: new Date(Date.now()).toISOString().split('T')[0],
        });
    }

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
                <Row style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)', marginBottom: '10px'}}>
                    <Col xs={9}>
                        <Form.Control
                            type="date"
                            name="endingDate"
                            value={formData.endingDate}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                    <Col xs={3}>
                        <Button variant="danger" type="button" onClick={handleEndNowClick} style={{ marginTop: '10px' }}>
                            End now
                        </Button>
                    </Col>
                </Row>

            </Form.Group>

            <CloudinaryUploadWidget style={{ marginTop: '10px', marginBottom: '10px' }}/>

            <Form.Group controlId="formSubmit">
                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Submit
                </Button>
            </Form.Group>
        </Form>
    );

}
export default EditProductForm;