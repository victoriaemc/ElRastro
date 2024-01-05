import { Row, Button} from 'react-bootstrap';

const BidDetails = ({ lastBid, productId }) => {

    return (
            <Row>
                <div className="mb-2 p-2 border rounded d-flex flex-column justify-content-center" style={{ width: "100%" }}>
                    <h5 className="mb-3">Puja más alta</h5>
                    <p className="mb-3">{lastBid}</p>
                    <Button href={`bidUp?ProductId=${productId}`} variant="primary">Pujar</Button>
                </div>
            </Row>

    );
};

export default BidDetails;
