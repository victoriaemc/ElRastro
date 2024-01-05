import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';

const BidsOnProduct = ({user}) => {
    const [bids, setBids] = useState([]);
    const { productId } = useParams();
    const thisUser = JSON.parse(user);

    useEffect(() => {
        async function fetchBids() {
            try {
                const response = await fetch(process.env.REACT_APP_GATEWAY + `/bids/?product=${productId}&user=${thisUser._id}`);
                if (!response.ok) {
                    throw new Error(`An error occurred: ${response.statusText}`);
                }
                const data = await response.json();
                setBids(data);
            } catch (error) {
                console.error("Error fetching bids:", error);
            }
        }

        fetchBids();

        return () => setBids([]);
    }, [productId]);

    const bidList = bids.map((bid) => (
        <tr key={bid._id}>
            <td>{bid.price}</td>
            <td>{bid.date}</td>
            {/* Add more details if needed */}
        </tr>
    ));

    return (
        <div>
            <h3>Mis pujas para </h3>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Puja</th>
                    <th>Fecha</th>
                    {/* Add more header columns if needed */}
                </tr>
                </thead>
                <tbody>{bidList}</tbody>
            </Table>
            <Button variant="outline-secondary" href={`/productDetails?ProductId=${productId}`}>
                Back to Product Details
            </Button>
        </div>
    );
};

export default BidsOnProduct;
