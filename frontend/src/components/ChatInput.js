import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Escribe un mensaje"
            />
            <button onClick={handleSendMessage}>Enviar</button>
        </div>
    );
};

export default MessageInput;
