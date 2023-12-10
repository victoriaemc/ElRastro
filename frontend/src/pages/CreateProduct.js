import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateProductForm from "../components/CreateProductForm";
// import bootstrap and react-bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';
import CreateProductFormulary from "../components/CreateProductFormulary";

export default function CreateProduct(){
    return(<div>
        <h2 className="text-center mb-5">Crear producto</h2>
        <CreateProductFormulary/>
        </div>)
}