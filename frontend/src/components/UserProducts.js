import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import axios from "axios";

const UserProducts = ({ userId }) => {
    const { id } = useParams();
    const [products, setProducts] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/myProducts?user=${id}`);
                const userData = await axios.get(`http://localhost:8000/users/${id}`);
                console.log(response);
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
                                        <p>Insertar foto del producto</p>
                                    </div>
                                </div>
                            </Col>
                            <Col key={product._id}>
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description}</p>
                                        <a href={`http://localhost:3000/productDetails?ProductId=${product._id}`} className="btn btn-outline-secondary">Ver producto</a>
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
