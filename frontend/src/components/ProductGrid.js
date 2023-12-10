import CloudinaryImage from "./CloudinaryImage";

import { Link } from "react-router-dom/";

const ProductGrid = ({ products, title }) => {
    return (
      <div className="product-body">
        <h2 className="title">{ title }</h2>
        <div className="product-list">
        {products.map(product => (
          <div className="product-preview" key={product._id}>
            <Link to= {`/productDetails?ProductId=${product._id}`}>
              <img src={CloudinaryImage(product.imageId)}  alt={"Image"}/>
              <h2>{ product.name }</h2>
              <h2> ${product.startingPrice>=product.lastBid ? product.startingPrice : product.lastBid}</h2>
            </Link>
          </div>
        ))}
        </div>
      </div>
    );
  }
   
  export default ProductGrid;