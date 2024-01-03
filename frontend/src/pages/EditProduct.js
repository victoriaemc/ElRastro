import React from "react";
// import bootstrap and react-bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css';
import EditProductFormulary from "../components/EditProductFormulary";

export default function EditProduct({user}){
    return(<div>
        <h2 className="text-center mb-5">Editar producto</h2>
        <EditProductFormulary user={user}/>
    </div>)
}