// BidDetails.js
import React, { useState, useEffect } from "react";
import { Col, Row, Button, Card } from 'react-bootstrap';

const BidDetailsWithoutButton = ({ lastBid, endingDate }) => {

    return (
        <Row>
            <div className="mb-2 p-2 border rounded d-flex flex-column justify-content-center" style={{ width: "100%" }}>
                <h5 className="mb-3">Puja más alta</h5>
                <p className="mb-3">{lastBid}</p>
            </div>
        </Row>

    );
};

export default BidDetailsWithoutButton;