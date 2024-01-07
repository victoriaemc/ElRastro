import React, { useState, useEffect } from "react";
import { Row } from 'react-bootstrap';

const Countdown = ({ endingDate }) => {
    const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining());
        }, 1000);

        return () => clearInterval(timerInterval);
    }, []);

    function calculateTimeRemaining() {
        const now = new Date();
        const newEndingDate = new Date(endingDate);
        const timeDifference = newEndingDate - now;

        if (timeDifference <= 0) {
            // Si el tiempo restante es menor o igual a cero, establecerlo en cero
            return 0;
        }

        // Convertir la diferencia de tiempo a segundos
        return Math.floor(timeDifference / 1000);
    }

    // Convertir segundos a formato de tiempo (DD:HH:MM:SS)
    const formatTime = (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${days} días, ${String(hours).padStart(2, "0")} horas, ${String(minutes).padStart(2, "0")} minutos y ${String(remainingSeconds).padStart(2, "0")} segundos`;
    };

    return (

        <Row>
            <div className="mb-2 p-2 border rounded d-flex flex-column justify-content-center" style={{ width: "100%" }}>
                <h5 className="mb-3">Tiempo restante</h5>
                <p>{formatTime(timeRemaining)}</p>
            </div>
        </Row>

    );
};

export default Countdown;