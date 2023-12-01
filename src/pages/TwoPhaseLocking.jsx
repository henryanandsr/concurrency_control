import React, { useState } from 'react';
import TwoPhaseLockingAlgorithm from '../algo/TwoPhaseLockingAlgorithm';
import { Heading, Input, Button, Box, Text } from '@chakra-ui/react';

export default function TwoPhaseLocking() {
    const [inputSequence, setInputSequence] = useState('');
    const [result, setResult] = useState([]);

    const handleInputChange = (event) => {
        setInputSequence(event.target.value);
    };

    const handleButtonClick = () => {
        const twoPhaseLocking = new TwoPhaseLockingAlgorithm(inputSequence);
        twoPhaseLocking.execute();
        // Assuming setResult is meant to be updated with the result, modify this part accordingly
        setResult(twoPhaseLocking.getResultTable());
    };

    return (
        <Box 
        textAlign="center" 
        p={12} 
        height="100vh" 
        width={"100vw"} 
        alignItems="center" 
        justifyContent="center"
        background={"#edf2f7"}
        >
            <Heading mb={6}
            marginTop={"30vh"}
            color={"#2a4365"}
            >Two Phase Locking</Heading>
            <Input
                type="text"
                placeholder="Enter something..."
                value={inputSequence}
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
            }}>
                Submit
            </Button>

            {/* Display the result */}
            <Box mt={8}>
                <Heading size="md" mb={4}>
                    Result:
                </Heading>
                {result.length > 0 ? (
                    <Box textAlign="left">
                        <Text as="pre">{JSON.stringify(result, null, 2)}</Text>
                    </Box>
                ) : (
                    <Text>No result yet. Click 'Submit' to see the result.</Text>
                )}
            </Box>
        </Box>
    );
}