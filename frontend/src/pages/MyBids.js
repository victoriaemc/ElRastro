// MyBids

import React, { useState, useEffect } from "react";
import { Col, Row, Button, Card } from 'react-bootstrap';

// TODO: PONER EL ENLACE DE PUJA A DETALLES DEL PRODUCTO PARA PUJAR
const Bid = (props) => {
    const {hours, minutes, seconds} = calculateRemainingTime(new Date(props.bid.productDetails.endingDate));
    const canPlaceBid = props.bid.productDetails.lastBid > props.bid.price;
    return (
        <tr>
            <td>{props.bid.productDetails.name}</td>
            <td>{props.bid.price}</td>
            <td>{props.bid.productDetails.lastBid}</td>
            <td>{`${hours}h ${minutes}m ${seconds}s faltan`}</td>
            <td>
                {canPlaceBid && (
                <Button variant="outline-success" href={`/productDetails?ProductId=${props.bid.product}`}>
                    Pujar
                </Button>
                )}
            </td> 
        </tr>
    );
}

const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const difference = Math.floor((endDate - now) / 1000);

    if (difference <= 0) {
        // Si el tiempo restante es menor o igual a cero, establecerlo en cero
        return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(difference / 3600);
    const minutes = Math.floor((difference % 3600) / 60);
    const seconds = difference % 60;

    return {hours, minutes, seconds};
};
const MyBids = () => {
    const [bids, setBids] = useState([]);
    useEffect(() => {
        // Extraer bids del usuario
        async function getBid(){
            const response = await fetch('http://localhost:8000/bids?user=65720e41e0700cc1b8534119');
            if (!response.ok){
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const bids = await response.json();
            // Extraer los detalles del producto asociado
            const bidsWithProductDetails = await Promise.all(
                bids.map(async (bid) => {
                    const productResponse = await fetch(`http://localhost:8000/${bid.product}`);
                    if (!productResponse.ok){
                        const message = `An error ocurred fetching product details: ${productResponse.status}`;
                        window.alert(message);
                        return bid;
                    }

                    const productDetails = await productResponse.json();
                    bid.productDetails = productDetails;
                    return bid;
                })
            );
            
            const bidSortedByStartDate = bids.sort((a, b) => new Date(b.date) - new Date(a.date));
            setBids(bidSortedByStartDate);
        }
        const interval = setInterval(() => {
            setBids((prevBids) => prevBids.map((bid) => ({...bid})));
        }, 1000);
        getBid();
        return () => clearInterval(interval);
    }, [bids.length]);
    function bidList(){
        return bids.map((bid) => {
            return (
                <Bid
                    bid = {bid}
                    key = {bid._id}
                />
            );
        });
    }
    return (
        <div>
            <h3>Bid List</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                <tr>
                    <th>Product</th>
                    <th>Your bid</th>
                    <th>Max. Bid</th>
                    <th>Remaining time</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>{bidList()}</tbody>
            </table>
        </div>
    );
};

export default MyBids;