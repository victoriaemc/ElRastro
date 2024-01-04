import ChatPreview from "./ChatPreview";
import useApi from "../components/useApi";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

export default function MyChatsContainer({user}) {
    const thisUser = JSON.parse(user);
    console.log(thisUser._id);
    console.log(`${process.env.REACT_APP_GATEWAY}/chat/myChats/?userId=${thisUser._id}`);
    const {data, isLoading, isError} = useApi(`${process.env.REACT_APP_GATEWAY}/chat/myChats/?userId=${thisUser._id}`);
    console.log(data);
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading chats</div>;
    }

    if (data == null) {
        return <div>No tienes conversaciones abiertas</div>
    }

    return (
        <div>
            {data.map((chat) => (
                <Container>
                    <Row>
                        <Col></Col>
                        <Col xs={8}>
                            <Link to={`/chat/${chat.product}`}>
                                <ChatPreview
                                    //key={`${chat.users.join(',')}_${chat.product}`}
                                    productId={chat.product}
                                    lastMessage={chat.messages[0].text}
                                />
                            </Link>
                        </Col>
                        <Col></Col>
                    </Row>
                </Container>
            ))}
        </div>
    );
}