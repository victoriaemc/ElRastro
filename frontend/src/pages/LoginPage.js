// EN LA CARPETA PAGES IRAN LAS PAGINAS DE NUESTRA APP
import React from "react";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
function LoginPage(){
/*  const login = useGoogleLogin({
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
  });*/
    const handleLogin = async (credentialResponse) => {
        var obj = jwtDecode(credentialResponse.credential);
        //var data = JSON.stringify(obj);
        //console.log(data);

        //const data = {};

        const config = {
            method: 'POST',
            url: 'http://localhost:8000',
            headers: {},
            //data: data
        }

        await axios(config)
    }
  return(
  <GoogleOAuthProvider clientId={"133771592681-sf648miprtjn4spn88k9flo64g3ajr22.apps.googleusercontent.com"}>
  <GoogleLogin
    onSuccess={handleLogin}
      /*onSucces={(credentialResponse) => {
      var credentialResponseDecoded = jwt_decode(credentialResponse.credential);
      console.log(credentialResponse);
    }}*/
    onError={()=> {
      console.log("Login failed");
    }}
    /> </GoogleOAuthProvider>
  );
}

export default LoginPage