import BidsOnProduct from "../components/BidsOnProduct";

export default function BidsHistory(){
    const user = localStorage.getItem("user")
    return <BidsOnProduct user={user}/>
}