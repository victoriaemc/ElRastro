// src/components/PaypalButton.js
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PaypalButton = ({ amount }) => {
    console.log(amount);
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
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            console.log(details);
            // Aquí puedes manejar el pago exitoso, por ejemplo, actualizar el estado de tu aplicación.
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
