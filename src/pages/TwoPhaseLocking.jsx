import React, { useState } from 'react';
import TwoPhaseLockingAlgorithm from "../algo/TwoPhaseLockingAlgorithm";

export default function TwoPhaseLocking() {
    const [inputSequence, setInputSequence] = useState('');
    const [result, setResult] = useState([]);

    const handleInputChange = (event) => {
        setInputSequence(event.target.value);
    };

    const handleButtonClick = () => {
        const parsedResult = TwoPhaseLockingAlgorithm(inputSequence);
        setResult(parsedResult);
    };

    return (
        <>
            <h1>Two Phase Locking</h1>
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
