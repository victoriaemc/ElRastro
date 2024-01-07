import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import CreateProductFormulary from "../components/CreateProductFormulary";

export default function CreateProduct({user}){
    return(<div>
        <h2 className="text-center mb-5">Crear producto</h2>
        <CreateProductFormulary user={user}/>
        </div>)
}