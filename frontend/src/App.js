import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";


// Imports cloudinary
import CloudinaryUploadWidget from "./components/CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Imports Pages and Components
import LoginPage from './pages/LoginPage'; 
import HomePage from './pages/HomePage'
import ElRastroNavbar from './components/ElRastroNavbar';
import ProductDetails from './pages/ProductDetails';
import BiddingUpPage from './pages/BiddingUpPage';
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import UserProfile from "./pages/UserProfile";
import EditUser from "./pages/EditUser";
import MyBids from "./pages/MyBids";
import ChatPage from "./pages/ChatPage";
import SearchPage from "./pages/SearchPage";
import PaymentPage from "./pages/PaymentPage";
function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = process.env.REACT_APP_GATEWAY + "/users/login/success";
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data from /users/login/success:", data);
        console.log("User from /users/login/success:", data.user);

        setUser(data.user);

        if (data.user) {
          console.log("User data structure is correct:", data.user);
        } else {
          console.error("User data structure is incorrect:", data);
        }

        // Use the updated user immediately after setting it
        console.log("User: ", data.user);
      } catch (e) {
        console.error(e);
      }
    };


    fetchUser();
  }, []);


  // Cloudinary vars----------------------------------------------
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("daef41lib");
  const [uploadPreset] = useState("x1njk2mp");
  const [uwConfig] = useState({
    cloudName,
    uploadPreset
  });
  const cld = new Cloudinary({
    cloud: {
      cloudName
    }
  });
  const myImage = cld.image(publicId);

  return (
    <div className="App">
      {/* RUTAS DE LAS PAGINAS  */}
      <BrowserRouter>
        <ElRastroNavbar user={user}/>
        <Routes>
          <Route path="/" element={<h1><HomePage/></h1>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/etc" element={<h1>Etc page</h1>}/>
          <Route path="/productDetails" element={<ProductDetails user={user}/>}/>
          <Route path="/bidUp" element={<BiddingUpPage/>}/>
          <Route path="/biddingUp" element={<BiddingUpPage/>}/>
          <Route path="/createProduct" element={<CreateProduct user={user}/>}/>
          <Route path="/editProduct/:id" element={<EditProduct/>}/>
          <Route path="/userProfile/:id" element={<UserProfile user={user}/>}/>
          <Route path="/userProfile/:id/edit" element={<EditUser/>}/>
          <Route path="/myBids/:id" element={<MyBids/>}/>
          <Route path="/chat/:productId" element={<ChatPage/>}/>
          <Route path="/search/:filter" element={<SearchPage/>}/>
          <Route path="/pay/:productId" element={<PaymentPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
