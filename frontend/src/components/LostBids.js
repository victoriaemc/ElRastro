import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import {Button, Table} from 'react-bootstrap';

const LostBids = () => {
    const [wonBids, setWonBids] = useState([]);
    const user = localStorage.getItem("user");
    const thisUser = JSON.parse(user);
    const userId = thisUser._id;

    useEffect(() => {
        // Realiza la llamada a la API para obtener las subastas ganadas por el usuario
        const fetchWonBids = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_GATEWAY}/bids/lostBids?userId=${userId}`);
                if (!response.ok) {
                    throw new Error(`Error fetching won bids: ${response.statusText}`);
                }
                const data = await response.json();

                // Realiza las llamadas a la API para obtener los detalles de los productos
                const bidsWithProductDetails = await Promise.all(
                    data.map(async (bid) => {
                        const productResponse = await fetch(`${process.env.REACT_APP_GATEWAY}/${bid.product}`);
                        if (!productResponse.ok) {
                            console.error(`Error fetching product details for bid ${bid._id}: ${productResponse.statusText}`);
                            return null;
                        }
                        const productDetails = await productResponse.json();
                        return { ...bid, productDetails };
                    })
                );

                setWonBids(bidsWithProductDetails);
            } catch (error) {
                console.error('Error fetching won bids:', error);
            }
        };

        // Llama a la función para obtener las subastas ganadas
        fetchWonBids();
    }, [userId]);

    return (
        <div>
            <h3>Subastas perdidas</h3>
            {wonBids.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio ganador</th>
                    </tr>
                    </thead>
                    <tbody>
                    {wonBids.map((bid) => (
                        <tr key={bid._id}>
                            <td>
                                <Link to={`/productDetails?ProductId=${bid.product}`}>
                                    {bid.productDetails.name}
                                </Link>
                            </td>
                            <td>{bid.productDetails.lastBid}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            ) : (
                <p>No has perdido ninguna subasta.</p>
            )}
        </div>
    );
};

export default LostBids;
