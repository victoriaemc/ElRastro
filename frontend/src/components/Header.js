import React,{useState} from 'react';
import { MDBInputGroup, MDBInput, MDBIcon, MDBAlert, MDBBtn } from 'mdb-react-ui-kit';

export const Header = () => {

    const loginProfile = () => {

    };

    return (<MDBInputGroup>
        <MDBInput label='Search' />
        <MDBBtn rippleColor='dark'>
            <MDBIcon icon='search' />
        </MDBBtn>
    </MDBInputGroup>);
};

export default Header;