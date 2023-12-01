import React, { useState } from 'react';
import { Heading, Input, Button, Box, Text, Center } from '@chakra-ui/react';
import MVCCAlgorithm from '../algo/MVCCAlgorithm';

export default function MVCC() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleButtonClick = () => {
        const algo = new MVCCAlgorithm(input);
        algo.execute();
        setResult(algo.result);

        const uniqueTransactions = [...new Set(algo.result.map(item => item.transaction))];
        setTransactions(uniqueTransactions);
    };

    return (
        <Box
            textAlign="center"
            p={12}
            minHeight="100vh"
            height="100%"
            width={"100vw"}
            alignItems="center"
            justifyContent="center"
            background={"#edf2f7"}
        >
            <Heading mb={6} color={"#2a4365"} marginTop={"30vh"}>
                Multiversion Timestamp Ordering Concurrency Control
            </Heading>
            <Input
                type="text"
                placeholder="Enter something..."
                value={input}
                onChange={handleInputChange}
                mb={4}
                width={"50vw"}
                background={"white"}
            />
            <Button
                onClick={handleButtonClick}
                colorScheme="blue"
                marginLeft={4}
                _hover={{
                    bg: "white",
                    color: "#4299e1",
                }}
            >
                Submit
            </Button>

            {/* Display the result */}
            <Box mt={8} overflowY="auto" maxH="100%" justifyContent="center">
                <Heading size="md" mb={4}>
                    Result:
                </Heading>
                {result.length > 0 && transactions.length > 0 ? (
                    <Box>
                        {/* Render each element inside a ul */}
                        {result.map((item, index) => (
                            <ul key={index}>
                                <li>{item}</li>
                            </ul>
                        ))}
                    </Box>
                ) : (
                    <Text>No result yet. Click 'Submit' to see the result.</Text>
                )}
            </Box>
        </Box>
    );
}
