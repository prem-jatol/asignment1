import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <Link to="/dashboard">Go to Dashboard</Link>
            <br />
            <Link to="/course">Go to User form</Link>
        </div>
    );
}

export default Home;
