import React, { useState, useEffect } from "react";
import BidsOnProduct from "../components/BidsOnProduct";

export default function BidsHistory(){
    const user = localStorage.getItem("user")
    console.log("Esto en la pagina ", user);
    return <BidsOnProduct user={user}/>
}