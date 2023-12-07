import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import axios from "axios";

const UserDetails = ({userId}) => {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [ratings, setRatings] = useState(null);


    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${id}`);
                const ratingsResponse = await axios.get(`http://localhost:8000/users/ratings/average?user=${id}`);
                if (response.status===200) {
                    const userData = await response.data;
                    setUser(userData);
                    const ratingsData = await ratingsResponse.data;
                    setRatings(ratingsData);
                } else {
                    console.error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails().then(r => console.log("User details fetched"));

    }, [userId]);
    // TODO: Add a button to edit the user details (only if logged in user is the same as the user being viewed)
    // TODO: Add a button to delete the user (only if logged in user is the same as the user being viewed)
    // TODO:
    return(<div>
            {user ? (
                <div>
                    <h2 className="text-center mb-5">Perfil de usuario</h2>
                    <Row>
                        <Col key="edit">
                            <Button variant="primary" href={`/userProfile/${id}/edit`}>Editar perfil</Button>
                        </Col>
                        <Col key="delete">
                            <Button variant="danger" href={`/users/${id}/delete`}>Eliminar cuenta</Button>
                        </Col>

                    </Row>

                    <Row>
                        <Col key="rating">
                            <h2>Valoración media : {ratings ? ratings.averageRating : <p>Cargando valoración media...</p>}</h2>
                           {/* <img src={user.profilePicture} alt="Imagen de perfil" width="200" height="200"/>*/}
                            <p>Foto de perfil aquí</p>
                        </Col>
                        <Col>
                            <h4>Nombre: {user.name}</h4>
                            <h4>Nombre de usuario: {user.username}</h4>
                            <h4>Correo electrónico: {user.email}</h4>
                        </Col>

                    </Row>
                </div>
            ) : (
                <p>Cargando datos de usuario...</p>

            )}
        </div>
    )
}
export default UserDetails;