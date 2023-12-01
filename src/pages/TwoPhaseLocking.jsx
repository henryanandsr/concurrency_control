import React, { useState } from 'react';
import TwoPhaseLockingAlgorithm from '../algo/TwoPhaseLockingAlgorithm';
import { Heading, Input, Button, Box, Text, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

export default function TwoPhaseLocking() {
    const [inputSequence, setInputSequence] = useState('');
    const [result, setResult] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const handleInputChange = (event) => {
        setInputSequence(event.target.value);
    };

    const handleButtonClick = () => {
        const twoPhaseLocking = new TwoPhaseLockingAlgorithm(inputSequence);
        twoPhaseLocking.execute();
        // Assuming setResult is meant to be updated with the result, modify this part accordingly
        setResult(twoPhaseLocking.resultTable);
        var uniqueTransactions = [...new Set(twoPhaseLocking.resultTable.map(item => item.transaction))];
        console.log("transactions");
        console.log(uniqueTransactions);
        setTransactions(uniqueTransactions);
        setResult(twoPhaseLocking.resultTable);
    };

    return (
        <Box 
        textAlign="center" 
        p={12} 
        height="100%"
        minHeight="100vh"
        width={"100vw"} 
        alignItems="center" 
        justifyContent="center"
        background={"#edf2f7"}>
            <Heading mb={6}
            color={"#2a4365"}
            marginTop={"30vh"}
            >Two-Phase Locking</Heading>
            <Input
                type="text"
                placeholder="Enter something..."
                value={inputSequence}
                onChange={handleInputChange}
                mb={4}
                width={"50vw"}
                background={"white"}
            />
            <Button onClick={handleButtonClick} 
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
            <Box mt={8} overflowY="auto" maxH="100%">
                <Heading size="md" mb={4}>
                    Result:
                </Heading>
                {result.length > 0 && transactions.length > 0 ? (
                    <Table variant="striped" colorScheme="blue">
                        <Thead>
                            <Tr>
                                <Th>Iteration</Th>
                                {transactions.map((transaction) => (
                                    <Th key={transaction}>{transaction}</Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {result.map((row, index) => (
                                <Tr key={`${row.transaction}-${row.type}-${index}`}>
                                    <Td>{index + 1}</Td>
                                    {transactions.map((transaction) => (
                                        <Td key={`${transaction}-${row.type}-${index}`}>{row.transaction === transaction ? row.action : ''}</Td>
                                    ))}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                ) : (
                    <Text>No result yet. Click 'Submit' to see the result.</Text>
                )}
            </Box>
        </Box>
    );
};