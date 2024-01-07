import { useState, useEffect } from 'react';

const UseUser = () => {
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

                setUser(data.user);

                if (!data.user) {
                    console.error("User data structure is incorrect:", data);
                }

            } catch (e) {
                console.error(e);
            }
        };

        fetchUser();
    }, []);

    return user;
};

export default UseUser;
