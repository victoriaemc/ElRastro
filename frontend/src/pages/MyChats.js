import React from "react";
import MyChatsContainer from "../components/MyChatsContainer";

export default function MyChats({user}){
    return (
        <div>
            <h1>Mis chats</h1>
            <MyChatsContainer user={localStorage.getItem("user")}/>
        </div>
    );
}