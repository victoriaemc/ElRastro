import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";

const CreateProductFormulary = (user) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState(0);
    const [lastBid, setLastBid] = useState(0);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [publicationDate, setPublicationDate] = useState(new Date());
    const [endingDate, setEndingDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [finished, setFinished] = useState(false);
    const [imageId, setImageId] = useState('oobx1cx1ymchdsnxz7sg');
    const [isPending, setIspending] = useState(false);


    const [cloudName] = useState("daef41lib");
    const [uploadPreset] = useState("x1njk2mp");
    const [uwConfig] = useState({
        cloudName,
        uploadPreset
      });
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        if (user.user != null){
            e.preventDefault();
            const producto = {
                name,
                description,
                user: user.user._id,
                startingPrice,
                lastBid,
                latitude,
                longitude,
                publicationDate: new Date(publicationDate),
                endingDate: new Date(endingDate),
                imageId,
                finished
            };


            setIspending(true);

            fetch(process.env.REACT_APP_GATEWAY, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(producto)
            }).then(() => {
                console.log("New product added: " + JSON.stringify(producto));
                setIspending(false);
                //history.go(-1);
                //history.push('/');
                navigate(-1);
            })
        }
    }

    useEffect(() => {
        const fetchUserLocation = async () => {
            try {
                const apiUrl = process.env.REACT_APP_GATEWAY+'/users/userLocation';
                const response = await axios.get(apiUrl);

                // Extract latitude and longitude from the API response
                const { latitude, longitude } = response.data;

                // Update the form data with the obtained latitude and longitude
                /* setFormData(prevFormData => ({
                    ...prevFormData,
                    latitude: latitude.toString(),
                    longitude: longitude.toString()
                })); */
                setLatitude(latitude.toString());
                setLongitude(longitude.toString());
            } catch (error) {
                console.error('Error fetching user location:', error.message);
            }
        };

        fetchUserLocation().then(r => console.log('User location fetched'));
    }, []);

    return (
/*        <div>
        {(user.user !== null) ? (
        <div className="create">
            <h2> Sube un producto </h2>
            <form onSubmit={handleSubmit}>
                <label> Nombre del producto: </label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label> Descripción del producto: </label>
                <textarea
                    required
                    value = {description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <label> Starting Price: </label>
                <input
                    type="number"
                    required
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                />
                <label> Location: </label>
                <input
                    type="number"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                />
                <input
                    type="number"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                />
                <label> Ending Date: </label>
                <input
                    type="date"
                    required
                    value={endingDate}
                    onChange={(e) => setEndingDate(e.target.value)}
                />
                <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setImageId} />
                { !isPending && <button> Subir producto </button> }
                { isPending && <button disabled> Subiendo producto... </button> }
            </form>
        </div>
        ) : (
            <LoginButton/>
        )}
        </div>*/
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
                <Form.Label>Fecha de finalización</Form.Label>
                <Form.Control
                    type="date"
                    name="endingDate"
                    value={endingDate}
                    onChange={(e) => setEndingDate(e.target.value)}
                    required
                    style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
                />
            </Form.Group>

            <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setImageId} />

            <Form.Group controlId="formSubmit">
                { !isPending && <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Subir producto
                </Button>}
                { isPending && <Button variant="primary" type="submit" style={{ marginTop: '10px' }} disabled={true}>
                    Subir producto
                </Button> }
            </Form.Group>


        </Form>
     );
}
 
export default CreateProductFormulary;