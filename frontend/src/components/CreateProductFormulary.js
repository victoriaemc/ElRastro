import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import LoginButton from "./LoginButton";
import axios from "axios";

const CreateProductFormulary = (user) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
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
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        if (user.user != null){
            e.preventDefault();
            console.log(user.user._id);
            const producto = {
                name,
                description,
                user: user.user._id,
                startingPrice,
                lastBid,
                latitude,
                longitude,
                publicationDate: new Date(publicationDate),
                endingDate: new Date(endingDate),
                imageId,
                finished
            };

            console.log(imageId);

            setIspending(true);

            fetch(process.env.REACT_APP_GATEWAY, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(producto)
            }).then(() => {
                console.log("New product added: " + JSON.stringify(producto));
                setIspending(false);
                //history.go(-1);
                //history.push('/');
                navigate(-1);
            })
        }
    }

    useEffect(() => {
        const fetchUserLocation = async () => {
            try {
                const apiUrl = process.env.REACT_APP_GATEWAY+'/users/userLocation';
                const response = await axios.get(apiUrl);

                // Extract latitude and longitude from the API response
                const { latitude, longitude } = response.data;

                // Update the form data with the obtained latitude and longitude
                /* setFormData(prevFormData => ({
                    ...prevFormData,
                    latitude: latitude.toString(),
                    longitude: longitude.toString()
                })); */
                setLatitude(latitude.toString());
                setLongitude(longitude.toString());
            } catch (error) {
                console.error('Error fetching user location:', error.message);
            }
        };

        fetchUserLocation().then(r => console.log('User location fetched'));
    }, []);

    return (
        <div>
        {(user.user !== null) ? (
        <div className="create">
            <h2> Add a new blog </h2>
            <form onSubmit={handleSubmit}>
                <label> Product name: </label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label> Product description: </label>
                <textarea
                    required
                    value = {description}
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
                <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setImageId} />
                { !isPending && <button> Add Product </button> }
                { isPending && <button disabled> Adding Product... </button> }
            </form>
        </div>
        ) : (
            <LoginButton/>
        )}
        </div>
     );
}
 
export default CreateProductFormulary;