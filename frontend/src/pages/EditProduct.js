import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import bootstrap and react-bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css';
import EditProductForm from "../components/EditProductForm";
import EditProductFormulary from "../components/EditProductFormulary";

export default function EditProduct(){
    return(<div>
        <h2 className="text-center mb-5">Editar producto</h2>
        <EditProductFormulary/>
    </div>)
}