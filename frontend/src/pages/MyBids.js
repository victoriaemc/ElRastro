// MyBids

import React, { useState, useEffect } from "react";
import { Col, Row, Button, Card } from 'react-bootstrap';

// TODO: PONER EL ENLACE DE PUJA A DETALLES DEL PRODUCTO PARA PUJAR
const Bid = (props) => {
    const {days,hours, minutes, seconds} = calculateRemainingTime(new Date(props.bid.productDetails.endingDate));

    return (
        <tr>
            <td>{props.bid.productDetails.name}</td>
            <td>{props.bid.price}</td>
            <td>{`Faltan ${days} días ${hours}h ${minutes}m ${seconds}s`}</td>
            {(props.bid.productDetails.lastBid === props.bid.price) && (props.bid.productDetails.finished === true) ? (
                <td><Button variant="outline-success" href={`/pay/${props.bid.product}`}>Pagar</Button></td>
            ) : (
                <td><Button variant="outline-success" href={`/${props.bid.product}`}>Pujar PENDIENTE</Button></td>
            )}
        </tr>
    );
}

const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const difference = Math.floor((endDate - now) / 1000);

    if (difference <= 0) {
        return 0;
    }

    const days = Math.floor(difference / (3600*24));
    const hours = Math.floor((difference % (3600*24))/ 3600 ) ;
    const minutes = Math.floor((difference % 3600) / 60);
    const seconds = difference % 60;

    return {days, hours, minutes, seconds};
};
const MyBids = () => {
    const user = localStorage.getItem("user")
    const thisUser = JSON.parse(user);
    const [bids, setBids] = useState([]);
    useEffect(() => {
        // Extraer bids del usuario
        async function getBid(){
            const response = await fetch(process.env.REACT_APP_GATEWAY+`/bids?user=${thisUser._id}`);
            if (!response.ok){
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const bids = await response.json();
            // Extraer los detalles del producto asociado
            const bidsWithProductDetails = await Promise.all(
                bids.map(async (bid) => {
                    const productResponse = await fetch(process.env.REACT_APP_GATEWAY+`/${bid.product}`);
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