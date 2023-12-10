import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import axios from "axios";

const EditProductFormulary = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [user, setUser] = useState("6550a4a5fadb65a38330bff9");
    const [startingPrice, setStartingPrice] = useState(0);
    const [lastBid, setLastBid] = useState(0);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [publicationDate, setPublicationDate] = useState(new Date());
    const [endingDate, setEndingDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [finished, setFinished] = useState(false);
    const [imageId, setImageId] = useState('oobx1cx1ymchdsnxz7sg');
    const [isPending, setIspending] = useState(false);

    const [cloudName] = useState("daef41lib");
    const [uploadPreset] = useState("x1njk2mp");
    const [uwConfig] = useState({
        cloudName,
        uploadPreset
    });

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const apiUrl = `http://localhost:8000/${id}`;
                const response = await axios.get(apiUrl);

                // Extract product details from the API response
                const { name, description, user, startingPrice, lastBid, latitude, longitude, publicationDate, endingDate, finished, imageId} = response.data;

                // Update the form fields with the obtained details
                setName(name);
                setDescription(description);
                setUser(user);
                setStartingPrice(startingPrice);
                setLastBid(lastBid);
                setLatitude(latitude);
                setLongitude(longitude);
                setPublicationDate(publicationDate);
                setEndingDate(endingDate);
                setFinished(finished);
                setImageId(imageId);
                // ... update other state variables ...
            } catch (error) {
                console.error('Error fetching product details:', error.message);
            }
        };

        fetchProductDetails().then(r => console.log('Product details fetched'));
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedProduct = {
            name,
            description,
            user,
            startingPrice,
            lastBid,
            latitude,
            longitude,
            publicationDate,
            endingDate,
            finished,
            imageId
            // ... other fields ...
        };

        axios.put(`http://localhost:8000/${id}`, updatedProduct)
            .then(() => {
                console.log("Product updated: " + JSON.stringify(updatedProduct));
                navigate(-1);
            })
            .catch(error => {
                console.error('Error updating product:', error.message);
            });
    }

    return (
        <div className="edit">
            <form onSubmit={handleSubmit}>
                {/* Render form fields similar to the create component */}
                <label>Product name:</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Product description:</label>
                <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <label> Starting Price: </label>
                <input
                    type="number"
                    required
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                />
                <label> Location: </label>
                <input
                    type="number"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                />
                <input
                    type="number"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                />
                <label> Ending Date: </label>
                <input
                    type="date"
                    required
                    value={endingDate}
                    onChange={(e) => setEndingDate(e.target.value)}
                />
                {/* ... other form fields ... */}
                <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setImageId} />
                { !isPending && <button> Update Product </button> }
                { isPending && <button disabled> Adding Product... </button> }
            </form>
        </div>
    );
}

export default EditProductFormulary;
