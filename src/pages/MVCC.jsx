import MVCCAlgorithm from '../algo/MVCCAlgorithm';
import {Button, Input} from '@chakra-ui/react';
import {useState} from 'react';
export default function MVCC() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const handleSubmit = () => {
        const algo = new MVCCAlgorithm(input);
        algo.execute();
    }
    const handleInputChange = (event) => {
        setInput(event.target.value);
    };
    return (
        <>
            <h1>Multiversion Timestamp Ordering Concurrency Control</h1>
            <Input
                type="text"
                placeholder="Enter something..."
                value={input}
                onChange={handleInputChange}
                mb={4}
            />
            <Button onClick={handleSubmit}>Submit</ Button>
        </>
    )
}