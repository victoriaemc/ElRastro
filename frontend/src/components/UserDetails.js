import React, { useEffect, useState } from "react";
import {useParams, Link} from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import CloudinaryImage from "./CloudinaryImage";

const UserDetails = ({userId}) => {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [ratings, setRatings] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalContent, setModalContent] = useState('confirm');
    const [deletionStatus, setDeletionStatus] = useState(null);



    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_GATEWAY+`/users/${id}`);
                const ratingsResponse = await axios.get(process.env.REACT_APP_GATEWAY+`/users/ratings/average?user=${id}`);
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


    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                process.env.REACT_APP_GATEWAY + `/users/${userId}`
            );
            console.log('Respuesta borrado:', response.data);
            if (response.status === 200) {
                console.log('User deleted successfully');
                setModalContent('success');
            } else {
                console.error('Failed to delete user');
                setDeletionStatus('failure'); // Update deletion status
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setDeletionStatus('failure'); // Update deletion status
        }
    };

    const handleLogout = () => {
        // Limpiar el estado local
        setUser(null);
        // Limpiar el localStorage
        localStorage.clear();
    };

    const openDeleteModal = () => setShowDeleteModal(true);
    const closeDeleteModal = () => setShowDeleteModal(false);

    return(<div>
            {user ? (
                <div>
                    <h2 className="text-center mb-5">Perfil de usuario</h2>
                    {user._id == userId ? (
                        <Row>
                            <Col key="edit">
                                <Button variant="primary" href={`/userProfile/${userId}/edit`}>Editar perfil</Button>
                            </Col>
                            <Col key="delete">
                                <Button variant="danger" onClick={openDeleteModal}>Eliminar cuenta</Button>
                            </Col>

                        </Row>
                    ):(
                        <p></p>
                    )}


                    <Row>
                        <Col key="rating">
                            <h2>Valoración media : {ratings ? ratings.averageRating : <p>Cargando valoración media...</p>}</h2>
                            <img src={CloudinaryImage(user.propicId)}  alt={"Image"} style={{
                                width: "auto",
                                height: "200px",
                                objectFit: "cover"
                            }}/>
                        </Col>
                        <Col>
                            <h4>Nombre: {user.name}</h4>
                            <h4>Nombre de usuario: {user.username}</h4>
                            <h4>Correo electrónico: {user.email}</h4>
                        </Col>

                    </Row>


                    {/* Delete Account Modal */}
                    <Modal
                        show={showDeleteModal}
                        onHide={closeDeleteModal}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {modalContent === 'success'
                                    ? 'Cuenta eliminada exitosamente'
                                    : 'Confirmar eliminación de cuenta'}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {modalContent === 'success'
                                ? 'Por favor, cierre sesión manualmente.'
                                : '¿Seguro que desea eliminar su cuenta?'}
                        </Modal.Body>
                        <Modal.Footer>
                            {modalContent === 'success' ? (
                                <Link to={process.env.REACT_APP_GATEWAY+`/users/logout`} onClick={handleLogout}>
                                    <Button variant="outline-danger">Cerrar sesión</Button>
                                </Link>
                            ) : (
                                <>
                                    <Button variant="secondary" onClick={closeDeleteModal}>
                                        Cancelar
                                    </Button>
                                    <Button variant="danger" onClick={handleDelete}>
                                        Eliminar cuenta
                                    </Button>
                                </>
                            )}
                        </Modal.Footer>
                    </Modal>
                </div>
            ) : (
                <p>Cargando datos de usuario...</p>

            )}
        </div>
    )
}
export default UserDetails;