import React from "react";
import ProductDetailsBigCard from "../components/ProductDetailsBigCard";

export default function ProductDetails({user}){
    return (
        <div>
            <ProductDetailsBigCard user={user}/>
        </div>
    )
}