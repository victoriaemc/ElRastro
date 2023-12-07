import React, {useEffect, useState} from "react";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import { useParams } from 'react-router-dom';

const EditUserForm = ({userId}) => {
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        profilePicture: ''
    });

    useEffect(() => {
        // Fetch existing user details using userId and set the form state
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${id}`);
                const existingUser = response.data;
                console.log(existingUser);
                setFormData({
                    name: existingUser.name,
                    username: existingUser.username,
                    email: existingUser.email,
                    password: existingUser.password,
                    profilePicture: existingUser.profilePicture
                });
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails().then(r => console.log("User details fetched"));
    }, [userId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make a PUT request to update the existing product
            await axios.put(`http://localhost:8000/users/${id}`, formData);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return(
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId={"formName"}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control type={"text"}
                              name={"name"}
                              value={formData.name}
                              onChange={handleChange}
                              required={true}
                              style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
                />
            </Form.Group>

            <Form.Group controlId={"formUsername"}>
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control type={"text"}
                              name={"username"}
                              value={formData.username}
                              onChange={handleChange}
                              required={true}
                              style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
                />
            </Form.Group>

            <Form.Group controlId={"formPassword"}>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type={"password"}
                              name={"password"}
                              value={formData.password}
                              onChange={handleChange}
                              required={true}
                              style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
                />
            </Form.Group>

            <Form.Group controlId={"formEmail"}>
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type={"email"}
                              name={"email"}
                              value={formData.email}
                              onChange={handleChange}
                              style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)', marginBottom: '10px'}}
                />
            </Form.Group>

            <CloudinaryUploadWidget style={{ marginTop: '10px', marginBottom: '10px' }}/>

            <Form.Group controlId="formSubmit">
                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Submit
                </Button>
            </Form.Group>

        </Form>
    )
}

export default EditUserForm;