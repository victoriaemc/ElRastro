import React, { useState, useEffect } from "react";
import ProductGrid from "../components/ProductGrid";
import useApi from "../components/useApi";

function HomePage() {
  const { data, isPending, error } = useApi(process.env.REACT_APP_GATEWAY);
  const [products, setProducts] = useState([]);
  //console.log(data);
  useEffect(() => {
    const activeProductsOnly = async () => {
      if (data && data.length) {
        let fechaFinal, fechaInicial;
        let productsNotFinished = [];
        let nuevaEndingDate;
        let diferencia;
        const currentDate = new Date();
        for (let i = 0; i < data.length; i++) {
          let producto = data[i];
          fechaFinal = new Date(producto.endingDate);
          fechaInicial = new Date(producto.publicationDate);
          if (fechaFinal - currentDate > 0) {
            console.log(`Nombre producto ${producto.name} añadido`);
            productsNotFinished.push(producto);
          } else if (producto.lastBid == 0) {
            // ó if(producto.startingPrice == producto.lastBid)
            // atributos endingDate y startingPrice actualizados
            /*
            console.log(
              `Fecha inicio: ${producto.publicationDate} Fecha Fin: ${producto.endingDate}`
            );
              */
            producto.startingPrice = producto.startingPrice * 0.9;

            diferencia = fechaFinal - fechaInicial;
            nuevaEndingDate = new Date(fechaFinal.getTime() + diferencia);
            producto.publicationDate = producto.endingDate;
            producto.endingDate = nuevaEndingDate.toISOString();
            /*
            console.log(
              ` NUEVA Fecha inicio: ${producto.publicationDate} Fecha Fin: ${producto.endingDate}`
            );
            */
            // Update a la bbdd
            try {
              const response = await fetch(
                process.env.REACT_APP_GATEWAY + `/${producto._id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(producto),
                }
              );
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
            } catch (error) {
              console.error("Error en el UPDATE en la base de datos: ", error);
            }
            productsNotFinished.push(producto);
          }
        }
        setProducts(productsNotFinished);
      }
    };
    activeProductsOnly();
  }, [data]);

  return (
    <div className="home">
      {error && <dif> Error: {error} </dif>}
      {isPending && <div> Loading... </div>}
      {products.length > 0 && (
        <ProductGrid products={products} title="Productos Destacados" />
      )}
    </div>
  );
}

export default HomePage;
