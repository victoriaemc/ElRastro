import React from "react";
import ProductGrid from "../components/ProductGrid";
import useApi from "../components/useApi"
function HomePage(){

  const {data, isPending, error} = useApi(process.env.REACT_APP_GATEWAY)


  return (
    <div className="home">
        {error && <dif> Error: {error} </dif>}
        {isPending && <div> Loading... </div>}
        {data && <ProductGrid products={data} title="Productos Destacados" />}
    </div> 

  )
}

export default HomePage