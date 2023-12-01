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
            padding={12}
            height="100vh"
            width="100vw"
            background={"#edf2f7"}
        >
            <Heading
            fontSize={"5xl"}
            mb={6}
            color={"#2a4365"}
            >Concurrency Control Examples</Heading>
            <Link to="/two-phase-locking">
                <Button mb={3}
                backgroundColor={"white"}
                _hover={{
                    bg: "#2a4365",
                    color: "white",
                }}
                >Two Phase Locking</Button>
            </Link>
            <Link to="/optimistic-concurrency-control">
                <Button mb={3}
                backgroundColor={"white"}
                _hover={{
                    bg: "#2a4365",
                    color: "white",
                }}
                >Optimistic Concurrency Control</Button>
            </Link>
            <Link to="/mvcc">
                <Button
                mb={3}
                backgroundColor={"white"}
                _hover={{
                    bg: "#2a4365",
                    color: "white",
                }}
                >Multiversion Timestamp Ordering Concurrency Control</Button>
            </Link>
        </Box>
    );
}
