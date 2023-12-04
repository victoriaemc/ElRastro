import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import axios from "axios";

// Imports cloudinary
import CloudinaryUploadWidget from "./components/CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

function App() {
  // Cloudinary vars----------------------------------------------
  const [publicId, setPublicId] = useState("");
  const [cloudName] = useState("daef41lib");
  const [uploadPreset] = useState("x1njk2mp");
  const [uwConfig] = useState({
    cloudName,
    uploadPreset
    // cropping: true, //add a cropping step
    // showAdvancedOptions: true,  //add advanced options (public_id and tag)
    // sources: [ "local", "url"], // restrict the upload sources to URL and local files
    // multiple: false,  //restrict upload to a single file
    // folder: "user_images", //upload files to the specified folder
    // tags: ["users", "profile"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    // clientAllowedFormats: ["images"], //restrict uploading to image files only
    // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    // theme: "purple", //change to a purple theme
  });
  const cld = new Cloudinary({
    cloud: {
      cloudName
    }
  });
  const myImage = cld.image(publicId);
  // -------------------------------------------------------------
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("http://localhost:8000/users/200")
        .then((res) => res.json())
        .then((data) => setMessage(data.message));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      {/* Div para el widget */}
      <div>
        <h3>Cloudinary Upload Widget Example</h3>
        <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} />
      </div>
      {/* Div para mostrar la imagen */}
      <div style={{ width: "800px" }}>
        <AdvancedImage
          style={{ maxWidth: "100%" }}
          cldImg={myImage}
          plugins={[responsive(), placeholder()]}
        />
      </div>
    </div>
  );
}

export default App;
