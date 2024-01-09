import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Alert } from 'react-bootstrap';

const PaypalButton = ({ amount, payed, productId }) => {
    const [isPayed, setPayed] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (isPayed || payed) {
        return (
            <>
                <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible>
                    ¡Pago exitoso!
                </Alert>
                <p>Ya has pagado este producto</p>
            </>
        );
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <PayPalScriptProvider options={{ 'client-id': 'AQCflpJzGTSa9XXgSMCbbjhKUNYOlMuE2iTBqhcUiPHImm1e7HDQhN90sHYKgdtEdkkb7NmviHc2zLOS', 'currency': "EUR" }}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: amount.toFixed(2),
                                },
                            },
                        ],
                    });
                }}
                onApprove={async (data, actions) => {
                    try {
                        const response = await fetch(process.env.REACT_APP_GATEWAY+`/${productId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ payed: true }),
                        });

                        if (response.ok) {
                            setPayed(true);
                            setRedirect(true);
                            setShowSuccess(true); // Mostrar el mensaje de éxito
                        } else {
                            console.error('Error al actualizar el atributo payed del producto');
                        }
                    } catch (error) {
                        console.error('Error en la solicitud de actualización del producto:', error);
                    }
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PaypalButton;
