import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Product = (props) => (
    <tr>
        <td>{props.product.name}</td>
        <td>{props.product.description}</td>
        <td>{props.product.startingPrice}</td>
        <td>
            <Link className="btn btn-link" to={`/editProduct/${props.product._id}`}>Edit</Link> |
            <button className="btn btn-link"
                    onClick={() => {
                        props.deleteProduct(props.product._id);
                    }}
            >
                Delete
            </button>
        </td>
    </tr>
);
export default function ProductList() {
    const [products, setProducts] = useState([]);
    // This method fetches the records from the database.
    useEffect(() => {
        async function getProduct() {
            const response = await fetch(`http://localhost:8000/`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const products = await response.json();
            setProducts(products);
        }
        getProduct();
        return;
    }, [products.length]);
    // This method will delete a record
    async function deleteProduct(id) {
        await fetch(`http://localhost:8000/${id}`, {
            method: "DELETE"
        });
        const newProduct = products.filter((el) => el._id !== id);
        setProducts(newProduct);
    }
    // This method will map out the records on the table
    function productList() {
        return products.map((product) => {
            return (
                <Product
                    product={product}
                    deleteProduct={() => deleteProduct(product._id)}
                    key={product._id}
                />
            );
        });
    }
    // This following section will display the table with the records of individuals.
    return (
        <div>
            <h3>Product List</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Level</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>{productList()}</tbody>
            </table>
        </div>
    );
}