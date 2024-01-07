import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import axios from "axios";
import CloudinaryImage from "./CloudinaryImage";

const UserProducts = ({ userId }) => {
    const { id } = useParams();
    const [products, setProducts] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_GATEWAY+`/myProducts?user=${id}`);
                const userData = await axios.get(process.env.REACT_APP_GATEWAY+`/users/${id}`);
                if (response.status === 200) {
                    const userProducts = response.data;
                    setProducts(userProducts);
                    setUser(userData.data);
                } else {
                    console.error('Failed to fetch user products');
                }
            } catch (error) {
                console.error('Error fetching user products:', error);
            }
        };

        fetchUserProducts().then(r => console.log("User products fetched"));
    }, [userId]);

    // This method will delete a record
    async function deleteProduct(id) {
        await fetch(process.env.REACT_APP_GATEWAY+`/${id}`, {
            method: "DELETE"
        });
        const newProduct = products.filter((el) => el._id !== id);
        setProducts(newProduct);
    }

    return (
        <div>
            <h2 className="text-center mb-5">Productos de {user ? user.name : "Cargando..."}</h2>

            {products ? (
                <div>
                    {products.map((product) => (

                            <Row>
                            <Col key={product._id}>
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <img src={CloudinaryImage(product.imageId)}  alt={"Imagen"}
                                             // style the images so that they mantain their aspect ratio but have a max height of 200px
                                                style={{
                                                    width: "auto",
                                                    height: "200px",
                                                    objectFit: "cover"
                                                }}
                                         />
                                    </div>
                                </div>
                            </Col>
                            <Col key={product._id}>
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description}</p>
                                        <ButtonGroup aria-label="Actions">

                                            <Button variant="outline-primary" href={`/productDetails?ProductId=${product._id}`}>Ver</Button>
                                            <Button variant="outline-secondary" href={`/editProduct/${product._id}`}>Editar</Button>
                                            <Button variant="outline-danger" onClick={
                                                () => {
                                                    deleteProduct(product._id);
                                                }
                                            }>Eliminar</Button>
                                        </ButtonGroup>
                                    </div>
                                </div>
                            </Col>

                        </Row>
                        ))}

                </div>
            ) : (
                <p>Cargando productos...</p>
            )}
        </div>
    );
};

export default UserProducts;
