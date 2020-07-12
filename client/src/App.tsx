import React, { useState, useCallback } from 'react';
import Axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
    const [phrase, setPhrase] = useState('');

    useCallback(
        (newPhrase: string) => {
            return Axios.get('localhost:9000');
        },
        [phrase],
    );

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newPhrase = event.target.value;
    }
    return (
        // <div className="App">
        //   <header className="App-header">
        //     <img src={logo} className="App-logo" alt="logo" />
        //     <p>
        //       Edit <code>src/App.tsx</code> and save to reload.
        //     </p>
        //     <a
        //       className="App-link"
        //       href="https://reactjs.org"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Learn React
        //     </a>
        //   </header>
        // </div>
        <div>
            <h1>graph</h1>

            <label htmlFor="word-searh">Keywords:</label>
            <input type="text" name="word-search" onChange={(event) => {}} id="word-search" />
        </div>
    );
}

export default App;
