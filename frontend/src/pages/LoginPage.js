import React from "react";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
function LoginPage(){
    const handleLogin = async (credentialResponse) => {
        try {
            const decodedToken = jwtDecode(credentialResponse.credential);
            console.log("Decoded Token:", decodedToken);

            // Make a request to your backend server with the token
            const response = await axios.post("http://localhost:8000/login", {
                token: credentialResponse.credential,
            });

            console.log("Server Response:", response.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID_VICKY}>
            <GoogleLogin
                onSuccess={handleLogin}
                onError={() => {
                    console.log("Login failed");
                }}
            />
        </GoogleOAuthProvider>
    );
}

export default LoginPage