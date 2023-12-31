
import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import {Link} from "react-router-dom";

const LoginButton = () => {

    const googleAuth = () => {
        window.open(
            process.env.REACT_APP_GATEWAY+'/users/google/callback',
            "_self"
        );
    };

    return (
        <div>
            <Button variant="primary" onClick={googleAuth}>Login with Google
            </Button>
        </div>
    );
};

export default LoginButton;
