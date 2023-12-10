import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import { Card } from "react-bootstrap"

const ChatContainer = () => {
    const [messages, setMessages] = useState([]);
    const { productId } = useParams();
    const userId = "654fc829545069d773dc1fdd";

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // console.log("Esto es prodfijisj " + productId);
                const response = await fetch(`http://localhost:8000/chat?from=${userId}&productId=${productId}`);
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [productId]);

    const handleSendMessage = async (message) => {
        try {
            await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: userId,
                    message: message,
                    productId: productId,
                }),
            });

            // Utilizar una función de actualización que garantiza que siempre se tiene un array
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: userId, text: message },
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    return (
        <div>
            <div>
                {messages.length > 0 && (
                    <div>
                        {messages.map((msg, index) => (
                            <div key={index}>
                                {console.log(msg)}
                                <strong>{msg.sender || msg.msg.sender}:</strong> {msg.text || msg.msg.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Componente de entrada de mensajes */}
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatContainer;
