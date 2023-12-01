import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Heading } from '@chakra-ui/react';

export default function Landing() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
        >
            <Heading mb={6}>Concurrency Control Examples</Heading>
            <Link to="/two-phase-locking">
                <Button mb={3}>Two Phase Locking</Button>
            </Link>
            <Link to="/optimistic-concurrency-control">
                <Button mb={3}>Optimistic Concurrency Control</Button>
            </Link>
            <Link to="/mvcc">
                <Button>Multiversion Timestamp Ordering Concurrency Control</Button>
            </Link>
        </Box>
    );
}
