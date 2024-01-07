import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";

const EditProductFormulary = (user) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState(0);
    const [lastBid, setLastBid] = useState(0);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [publicationDate, setPublicationDate] = useState(new Date());
    const [endingDate, setEndingDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [finished, setFinished] = useState(false);
    const [endNowClicked, setEndNowClicked] = useState(false);
    const [imageId, setImageId] = useState('oobx1cx1ymchdsnxz7sg');
    const [isPending, setIspending] = useState(false);

    const [cloudName] = useState("daef41lib");
    const [uploadPreset] = useState("x1njk2mp");
    const [uwConfig] = useState({
        cloudName,
        uploadPreset
    });

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const apiUrl = process.env.REACT_APP_GATEWAY+`/${id}`;
                const response = await axios.get(apiUrl);

                // Extract product details from the API response
                const { name, description,  startingPrice, lastBid, latitude, longitude, publicationDate, endingDate, finished, imageId} = response.data;

                // Update the form fields with the obtained details
                setName(name);
                setDescription(description);
                //setUser(user.user._id);
                setStartingPrice(startingPrice);
                setLastBid(lastBid);
                setLatitude(latitude);
                setLongitude(longitude);
                setPublicationDate(publicationDate);
                setEndingDate(endingDate);
                setFinished(finished);
                setImageId(imageId);
                // ... update other state variables ...
            } catch (error) {
                console.error('Error fetching product details:', error.message);
            }
        };

        fetchProductDetails().then(r => console.log('Product details fetched'));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProduct = {
            name,
            description,
            user: user.user._id,
            startingPrice,
            lastBid,
            latitude,
            longitude,
            publicationDate,
            endingDate,
            finished,
            imageId
            // ... other fields ...
        };

        axios.put(process.env.REACT_APP_GATEWAY+`/${id}`, updatedProduct)
            .then(() => {
                console.log("Product updated: " + JSON.stringify(updatedProduct));
                navigate(-1);
            })
            .catch(error => {
                console.error('Error updating product:', error.message);
            });
    }

    function handleEndNowClick() {
        setEndNowClicked(true);
        setFinished(true);
        setEndingDate(new Date(Date.now()).toISOString().split('T')[0]);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Nombre del producto"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
                />
            </Form.Group>
            <Form.Group controlId="formDescription">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Descripción del producto"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
                />
            </Form.Group>

            <Form.Group controlId="formStartingPrice">
                <Form.Label>Precio de salida</Form.Label>
                <InputGroup style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
                    <Form.Control
                        type="number"
                        placeholder="Precio de salida"
                        name="startingPrice"
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(e.target.value)}
                        required
                    />
                    <InputGroup.Text id="basic-addon2">€</InputGroup.Text>
                </InputGroup>
            </Form.Group>
            <Form.Group controlId={"formLocation"}>
                <Form.Label>Localización</Form.Label>
                <p>Las coordenadas se rellenan automáticamente con tu posición actual.</p>
                <Row style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Latitud"
                            name="latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            required
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Longitud"
                            name="longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            required
                        />
                    </Col>
                </Row>
            </Form.Group>

            <Form.Group controlId="formEndingDate">
                <Form.Label>Fin de la subasta</Form.Label>
                <Row style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)', marginBottom: '10px'}}>
                    <Col xs={9}>
                        <Form.Control
                            type="date"
                            name="endingDate"
                            value={endingDate}
                            onChange={(e) => setEndingDate(e.target.value)}
                            required
                        />
                    </Col>
                    <Col xs={3}>
                        <Button variant="danger" type="button" onClick={handleEndNowClick} style={{ marginTop: '10px' }}>
                            Terminar ahora
                        </Button>
                    </Col>
                </Row>

            </Form.Group>

            <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setImageId} />

            <Form.Group controlId="formSubmit">
                { !isPending && <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Aceptar cambios
                </Button>}
                { isPending && <Button variant="primary" type="submit" style={{ marginTop: '10px' }} disabled={true}>
                    Aceptar cambios
                </Button> }
            </Form.Group>

        </Form>
    );
}

export default EditProductFormulary;
