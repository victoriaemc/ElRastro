import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Button, Tabs, Tab} from 'react-bootstrap';

const Bid = (props) => {
    const {days,hours, minutes, seconds} = calculateRemainingTime(new Date(props.bid.productDetails.endingDate));
    const [showOptions, setShowOptions] = useState(false);
    const [myHighestBid, setMyHighestBid] = useState(null);

    const isWinning = props.bid.productDetails.lastBid === props.bid.price;
    const rowClass = isWinning ? 'table-success' : 'table-warning' ;

    useEffect(() => {
        // Realiza la llamada a la API para obtener el historial de pujas
        const fetchHighestBid = async () => {
            try {
                const user = localStorage.getItem("user")
                const thisUser = JSON.parse(user);
                const response = await fetch(process.env.REACT_APP_GATEWAY + `/bids/highestBid/?product=${props.bid.product}&userId=${thisUser._id}`);
                //console.log(process.env.REACT_APP_GATEWAY + `/bids/highestBid/?product=${props.bid.product}&userId=${thisUser._id}`)
                if (!response.ok) {
                    throw new Error(`Error fetching bid history: ${response.statusText}`);
                }
                const data = await response.json();
                setMyHighestBid(data.price);
            } catch (error) {
                console.error('Error fetching bid history:', error);
            }
        };

        // Llama a la función para obtener el historial de pujas
        fetchHighestBid();
    }, [props.bid.product]);

    return (
        <tr className={rowClass}>
            <td>
                <Link to={`/productDetails?ProductId=${props.bid.product}`}>
                    {props.bid.productDetails.name}
                </Link>
            </td>
            <td>{props.bid.productDetails.lastBid}</td>
            <td>
                {myHighestBid}
            </td>
            <td>{`Faltan ${days} días ${hours}h ${minutes}m ${seconds}s`}</td>
            {(props.bid.productDetails.lastBid === props.bid.price) && (props.bid.productDetails.finished === true) ? (
                <td><Button variant="outline-success" href={`/pay/${props.bid.product}`}>Pagar</Button></td>
            ) : (
                <td><Button variant="outline-success" href={`/${props.bid.product}`}>Pujar PENDIENTE</Button></td>
            )}
            <td>
                <Button variant="outline-dark" href={`/allBids/${props.bid.product}`}>Historial de pujas</Button>
            </td>
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
        async function getActiveBids(){
            const response = await fetch(process.env.REACT_APP_GATEWAY+`/bids/active?userId=${thisUser._id}`);
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
        getActiveBids();
        return () => clearInterval(interval);
    }, [bids.length]);
    function bidList(){
        const uniqueProducts = new Set();
        return bids
            .filter((bid) => {
            // Verificar si el producto ya está en el conjunto
            if (uniqueProducts.has(bid.product)) {
                return false; // Si ya está, omitir este bid
            } else {
                uniqueProducts.add(bid.product); // Agregar el producto al conjunto
                return true; // Incluir este bid en la lista
            }
        })
            .map((bid) => {
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
            <Tabs
                defaultActiveKey="activeBids"
                className="mb-3"
            >
                <Tab eventKey="activeBids" title="Subastas activas">
                    <h3>Subastas activas</h3>
                    <table className="table table-striped" style={{ marginTop: 20 }}>
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Puja más alta</th>
                            <th>Mi puja más alta</th>
                            <th>Tiempo restante</th>
                            <th>Action</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>{bidList()}</tbody>
                    </table>
                </Tab>
                <Tab eventKey="winnerBids" title="Subastas ganadas">

                </Tab>
            </Tabs>

        </div>
    );
};

export default MyBids;