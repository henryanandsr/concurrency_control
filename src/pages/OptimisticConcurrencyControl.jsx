import React, { useState } from 'react';
import { Heading, Input, Button, Box, Text, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import OCCAlgorithm from '../algo/OCCAlgorithm';

export default function OptimisticConcurrencyControl() {
    const [inputSequence, setInputSequence] = useState('');
    const [result, setResult] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const handleInputChange = (event) => {
        setInputSequence(event.target.value);
    };

    const handleButtonClick = () => {
        const result = OCCAlgorithm(inputSequence, false);
        var parsedResult = [];
        result.forEach(operation => {
            var operationResult = operation.match(/([RW])(\d+)\((\w+)\)/);
            var commitResult = operation.match(/(C)(\d+)/);
            if (operationResult) {
                var [type, action, transaction, resource] = operationResult;
                parsedResult.push({ type, action, transaction, resource });
            } else if (commitResult) {
                var [type, action, transaction] = commitResult;
                parsedResult.push({ type, action, transaction, resource: '-' });
            }
        });
        console.log(parsedResult)
        // get unique value of transaction
        var uniqueTransactions = [...new Set(parsedResult.map(item => item.transaction))];
        console.log("transactions");
        console.log(uniqueTransactions);
        setTransactions(uniqueTransactions);
        setResult(parsedResult);
    };

    return (
        <Box textAlign="center" p={10} height="100%" minHeight="100vh" width="100vw">
            <Heading mb={6}>Optimistic Concurrency Control</Heading>
            <Input
                type="text"
                placeholder="Enter something..."
                value={inputSequence}
                onChange={handleInputChange}
                mb={4}
            />
            <Button onClick={handleButtonClick} colorScheme="blue">
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
                                        <Td key={`${transaction}-${row.type}-${index}`} wrap="no-wrap">
                                            {row.transaction === transaction ? row.type : ''}
                                        </Td>
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
}
