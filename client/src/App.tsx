import React, { useState, useCallback } from 'react';
import Axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App() {
    const [phrase, setPhrase] = useState('');
    const [completions, setCompletions] = useState([]);
    const [url, setUrl] = React.useState('');

    async function getCompletions(newPhrase: string) {
        const { completionsWithPredictions } = await Axios.post(
            'http://localhost:4000/query/trie',
            {
                characters: newPhrase, // Buffer.from(newPhrase).toString('base64'),
            },
        ).then((res) => res.data);
        setCompletions(
            (completionsWithPredictions || [])
                .map((data: any) => {
                    return data.predictions.map((prediction: { toWord: any }) => {
                        return `${data.characters} ${prediction.toWord}`;
                    });
                })
                .flatMap((val: any) => val),
        );
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newPhrase = event.target.value;
    }

    function submitUrl() {
        const encodedUrl = Buffer.from(url).toString('base64');
        Axios.post('http://localhost:4000/index', { url: encodedUrl }).then((res) => {
            if (res.data === true) {
                alert(`${url} was indexed successfully.`);
            }
        });
    }

    return (
        <div>
            <input
                type="text"
                name="url"
                id="url"
                placeholder="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
            />
            <button onClick={() => submitUrl()}>Submit</button>
            <h1>graph</h1>

            <label htmlFor="word-searh">Keywords:</label>
            <input
                type="text"
                name="word-search"
                onChange={(event) => {
                    getCompletions(event.target.value);
                }}
                id="word-search"
            />
            {JSON.stringify(completions, null, 2)}
        </div>
    );
}

export default App;
