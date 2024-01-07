import React from "react";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import LoginButton from "../components/LoginButton";
import {Container} from "react-bootstrap";
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

        <Container>
            <LoginButton/>
        </Container>

    );
}

export default LoginPage