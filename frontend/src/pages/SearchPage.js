import React from "react";
import ProductGrid from "../components/ProductGrid";
import useApi from "../components/useApi"
import {useParams} from "react-router-dom";

function HomePage(){

    const {filter} = useParams();
    const {data, isPending, error} = useApi(process.env.REACT_APP_GATEWAY+`/?search=${filter}`);

    return (
        <div className="home">
            {error && <dif> Error: {error} </dif>}
            {isPending && <div> Loading... </div>}
            {data && <ProductGrid products={data} title={`Productos que coinciden con: ${filter}`} />}
        </div>

    )
}

export default HomePage