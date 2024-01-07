import React, {useEffect, useState} from "react";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditUserForm = ({userId}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [propicId, setPropicId] = useState('');
    const [isPending, setIspending] = useState(false);

    const [cloudName] = useState("daef41lib");
    const [uploadPreset] = useState("x1njk2mp");
    const [uwConfig] = useState({
        cloudName,
        uploadPreset
    });

    useEffect(() => {
        // Fetch existing user details using userId and set the form state
        const fetchUserDetails = async () => {
            try {

                const apiUrl = process.env.REACT_APP_GATEWAY+`/users/${id}`;
                const response = await axios.get(apiUrl);
                const { name, username, email, password, propicId } = response.data;
                setName(name);
                setUsername(username);
                setEmail(email);
                setPass(password);
                setPropicId(propicId);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails().then(r => console.log("User details fetched"));
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'username') {
            setUsername(value);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPass(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedUser = { name, username, email, password, propicId };

        axios.put(process.env.REACT_APP_GATEWAY+`/users/${id}`, updatedUser)
            .then(() => {
                console.log("User updated: " + JSON.stringify(updatedUser));
                navigate(`/userProfile/${id}`);
            })
            .catch(error => {
                console.error('Error updating user:', error.message);
            });
    };

    return(
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId={"formName"}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control type={"text"}
                              name={"name"}
                              value={name}
                              onChange={handleChange}
                              required={true}
                              style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
                />
            </Form.Group>

            <Form.Group controlId={"formUsername"}>
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control type={"text"}
                              name={"username"}
                              value={username}
                              onChange={handleChange}
                              required={true}
                              style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
                />
            </Form.Group>

            <Form.Group controlId={"formPassword"}>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type={"password"}
                              name={"password"}
                              value={password}
                              onChange={handleChange}
                              required={true}
                              style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}
                />
            </Form.Group>

            <Form.Group controlId={"formEmail"}>
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type={"email"}
                              name={"email"}
                              value={email}
                              onChange={handleChange}
                              style={{ width: '800px', position: 'relative', left: '50%', transform: 'translateX(-50%)', marginBottom: '10px'}}
                />
            </Form.Group>

            <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPropicId} style={{ marginTop: '10px', marginBottom: '10px' }}/>

            <Form.Group controlId="formSubmit">
                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Submit
                </Button>
            </Form.Group>

        </Form>
    )
}

export default EditUserForm;