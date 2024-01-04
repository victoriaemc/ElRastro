import { useState, useEffect } from 'react';

const UseUser = () => {
    const [user, setUser] = useState(null);
    console.log("Estoy aqui");

    useEffect(() => {

        console.log("Antes del fetchuser")
        const fetchUser = async () => {
            console.log("Antes del try");
            try {
                console.log("Hola");
                console.log(process.env.REACT_APP_GATEWAY);
                const url = process.env.REACT_APP_GATEWAY + "/users/login/success";
                console.log("URL es " + url);
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

                setUser(data.user);

                if (!data.user) {
                    console.error("User data structure is incorrect:", data);
                }
                console.log("El usuario: " + user);

            } catch (e) {
                console.error(e);
            }
        };

        fetchUser();
    }, []);

    return user;
};

export default UseUser;
