// EN LA CARPETA PAGES IRAN LAS PAGINAS DE NUESTRA APP
import React from "react";
import {GoogleLogin, useGoogleLogin} from "@react-oauth/google";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
function LoginPage(){
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${response.acces_token}`,
              },
            }
        );
        console.log(res);
      } catch (err){
        console.log(err);
      }
    },
  });
  return(
  <GoogleLogin
    onSucces={(credentialResponse) => {
      var credentialResponseDecoded = jwt_decode(credentialResponse.credential);
      console.log(credentialResponse);
    }}
    onError={()=> {
      console.log("Login failed");
    }}
    />
  );
}

export default LoginPage