import React from 'react';
import logo from '../logo.svg';
 
const Home = () => {
    return (
        <div>
            <div class="Title">
                <h1>Welcome to Spotifynder!</h1>
            </div>
            <img className="App-logo" src={logo} alt="Logo" />
        </div>
    );
};
 
export default Home;