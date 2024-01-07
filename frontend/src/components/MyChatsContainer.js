import ChatPreview from "./ChatPreview";
import useApi from "../components/useApi";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

export default function MyChatsContainer({user}) {
    const thisUser = JSON.parse(user);
    const {data, isLoading, isError} = useApi(`${process.env.REACT_APP_GATEWAY}/chat/myChats/?userId=${thisUser._id}`);
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
                <Container key={chat.product}>

                    {chat.productOwner ? (
                        <Row>
                            <Col></Col>
                            <Col xs={8}>
                                <Link to={(thisUser._id != chat.productOwner)
                                    ? `/chat/${chat.product}/${thisUser._id}`
                                    : `/chat/${chat.product}/${chat.users[0]}`}
                                      style={{ textDecoration: 'none' }}>
                                    <ChatPreview
                                        productId={chat.product}
                                        lastMessage={chat.messages[0].text}
                                    />
                                </Link>
                            </Col>
                            <Col></Col>
                        </Row>
                    ) : null }

                </Container>
            ))}
        </div>
    );
}