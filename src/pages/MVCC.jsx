import MVCCAlgorithm from '../algo/MVCCAlgorithm';
import {Box, Button, Input, Heading} from '@chakra-ui/react';
import {useState} from 'react';

export default function MVCC() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState([]);

    const handleSubmit = () => {
        const algo = new MVCCAlgorithm(input);
        algo.execute();
        setResult(algo.result);
    }
    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    return (
        <Box height="100vh" width={"100vw"} >
            <Heading>Multiversion Timestamp Ordering Concurrency Control</Heading>
            <Input
                type="text"
                placeholder="Enter something..."
                value={input}
                onChange={handleInputChange}
                mb={4}
            />
            <Button onClick={handleSubmit}>Submit</ Button>
            {/* Display the result */}
            <Box>
                <Heading>Result:</Heading>
                <Text>{JSON.stringify(result, null, 2)}</Text>
            </Box>
        </Box>
    )
}