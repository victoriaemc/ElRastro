import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import bootstrap and react-bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css';
import UserDetails from "../components/UserDetails";
import UserProducts from "../components/UserProducts";

export default function UserProfile({user}){
    return(<div>
        <UserDetails userId={user._id}/>
        <UserProducts user={user}/>
    </div>)
}