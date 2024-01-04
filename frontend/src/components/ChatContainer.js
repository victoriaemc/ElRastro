import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import ChatInput from '../components/ChatInput';

const ChatContainer = ({user}) => {
    const thisUser = JSON.parse(user);
    const [messages, setMessages] = useState([]);
    const [nombreProduct, setNombreProduct] = useState('');
    const { productId,buyerId } = useParams();
    const userId = thisUser._id;
    const [thisUsers, setThisUsers] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    process.env.REACT_APP_GATEWAY+`/chat?from=${buyerId}&productId=${productId}`
                );
                const data = await response.json();
                setMessages(data);

                const nombreProductResponse = await fetch(process.env.REACT_APP_GATEWAY+`/${productId}`);
                const nombreProductData = await nombreProductResponse.json();
                setNombreProduct(nombreProductData.name);
                if(nombreProductData.user == userId) {
                    console.log("Soy ese");
                    setThisUsers([userId, buyerId]);
                } else {
                    setThisUsers([userId, nombreProductData.user]);
                    console.log("No soy ese");
                }

                console.log(thisUsers);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [productId]);

    const handleSendMessage = async (message) => {
        try {
            await fetch(process.env.REACT_APP_GATEWAY+'/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: userId,
                    message: message,
                    productId: productId,
                    users: thisUsers
                }),
            });

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: userId, text: message },
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    console.log(messages);

    return (
        <div>
            <h1 className="display-4">Chat del producto {nombreProduct}</h1>
            <Card className="container mt-3">
                <div>

                    <div>
                        {messages.length > 0 && (
                            <Row className="mt-3">
                                <Col>
                                    {messages.map((msg, index) => (
                                        <Row key={index} className="mb-2">
                                            {((msg.sender == userId) || (msg.msg.sender == userId)) ? (
                                                <>
                                                    <Col md="6"></Col> {/* Columna vacía para equilibrar la fila */}
                                                    <Col md="6" className="text-right">
                                                        {/* Contenido para el mensaje del usuario */}
                                                        <Card className="bg-secondary text-white">
                                                            <Card.Body className="d-flex justify-content-between">
                                                                <div>{msg.text || msg.msg.text}</div>
                                                                <small>{(msg.msg === undefined) ? new Date().toISOString() : msg.msg.date}</small>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                </>
                                            ) : (
                                                <>
                                                    <Col md="6" className="text-left">
                                                        {/* Contenido para el mensaje de otro usuario */}
                                                        <Card className="bg-light">
                                                            <Card.Body className="d-flex justify-content-between">
                                                                <div>{msg.text || msg.msg.text}</div>
                                                                <small>{(msg.msg === undefined) ? new Date().toISOString() : msg.msg.date}</small>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    <Col md="6"></Col> {/* Columna vacía para equilibrar la fila */}
                                                </>
                                            )}
                                        </Row>
                                    ))}
                                </Col>

                            </Row>
                        )}
                    </div>
                    {/* Componente de entrada de mensajes */}
                    <ChatInput onSendMessage={handleSendMessage} />
                </div>
            </Card>
        </div>

    );
};

export default ChatContainer;
