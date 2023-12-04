import React from 'react';
import { Link } from 'react-router-dom';
const userInfo = ({item}) => {
    const {id, name, username, password, email} = item;
    return <Link to={"/users/{" + id + "}"}
    className="col" style={{ textDecoration: 'none'}}>
<div className="bg-white" style={{ width: '12rem', height: '22rem', flexDirection: 'column', justifyContent: 'space-around',  display: 'flex', paddingTop: '1rem', paddingBottom: '0.5rem', borderRadius: 7  }}>
<img variant="top" style={{ width: '12rem'}} src={"https://images.ctfassets.net/hrltx12pl8hq/3Mz6t2p2yHYqZcIM0ic9E2/3b7037fe8871187415500fb9202608f7/Man-Stock-Photos.jpg"} />
    <div className="col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
        <p className="display-5" style={{ fontSize: '1.2rem', color: '#3C3C3C'}}>{name}</p>
        <span className="m-1"style={{ fontSize: '0.8rem'}}>{username}</span>
        <p className="text-secondary font-weight-bold">₹{email}</p>
    </div>
</div>
</Link>
}