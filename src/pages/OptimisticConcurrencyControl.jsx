import React, { useState } from 'react';
import OCCAlgorithm from '../algo/OCCAlgorithm';

export default function OptimisticConcurencyControl() {
    const [inputSequence, setInputSequence] = useState('');
    const [result, setResult] = useState([]);

    const handleInputChange = (event) => {
        setInputSequence(event.target.value);
    };

    const handleButtonClick = () => {
        const parsedResult = OCCAlgorithm(inputSequence, false);
        console.log(parsedResult);
        setResult(parsedResult);
    };

    return (
        <>
            <h1>Optimistic Concurency Control</h1>
            <input
                type="text"
                placeholder="Enter something..."
                value={inputSequence}
                onChange={handleInputChange}
            />
            <button onClick={handleButtonClick}>Submit</button>

            {/* Display the result */}
            <div>
                <h2>Result:</h2>
                <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
        </>
    );
}