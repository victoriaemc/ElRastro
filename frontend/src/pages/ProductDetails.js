import React, {useEffect, useState} from "react";
import ProductDetailsBigCard from "../components/ProductDetailsBigCard";
import { useLocation } from "react-router-dom";


export default function ProductDetails({user}){
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const productId = searchParams.get("ProductId");
    const [product, setProduct] = useState({});
    const [sellerUser, setSellerUser] = useState({});
    let winner = useState({});
    useEffect(() => {
        async function getProduct() {
            try {
                const response = await fetch(process.env.REACT_APP_GATEWAY+`/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const product = await response.json();
                setProduct(product);
                // Call getSellerUsername with the user ID after setting the product
                getSellerUsername(product.user);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        }

        getProduct();
    }, [productId]);
        async function getSellerUsername(userId) {
            try {
                const response = await fetch(process.env.REACT_APP_GATEWAY+`/users/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const user1 = await response.json();
                setSellerUser(user1);
            } catch (error) {
                console.error('Error fetching seller:', error);
            }
        }
        async function getWinner(productId){
            try{
                const  bid = await fetch(process.env.REACT_APP_GATEWAY+`bids/highestBid?product=${productId}`);
                winner = bid.user;
            } catch (error) {
                console.error('Error fetching winner:', error);
            }
        }


    if(product.finished){
       getWinner(productId);
        if(winner.username === user.username || user.username === sellerUser.username){
       return (
        <div>
            <ProductDetailsBigCard user={user}/>
        </div>
    )
        }}else {
       /* return (
            <div>
                <ProductDetailsBigCard user={user}/>
            </div>
        )*/
    }

}