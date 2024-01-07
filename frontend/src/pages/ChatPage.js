import React from 'react';
import ChatContainer from '../components/ChatContainer';

const ChatPage = () => {
    return (
        <div>
            <ChatContainer user={localStorage.getItem("user")}/>
        </div>
    );
};

export default ChatPage;
