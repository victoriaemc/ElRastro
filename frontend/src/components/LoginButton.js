import React from 'react';

import Button from 'react-bootstrap/Button';

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
