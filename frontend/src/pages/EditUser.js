import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import bootstrap and react-bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css';
import EditUserForm from "../components/EditUserForm";

export default function EditUser({user}){
    // user = usuario logueado
    return(<div>
        <h2 className="text-center mb-5">Editar usuario</h2>
        <EditUserForm userId={user.user._id}/>
    </div>)
}