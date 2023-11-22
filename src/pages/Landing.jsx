import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <>
            <div>
                <Link to="/two-phase-locking">
                    <button>Two Phase Locking</button>
                </Link>
                <Link to="/optimistic-concurrency-control">
                    <button>Optimistic Concurrency Control</button>
                </Link>
                <Link to="/mvcc">
                    <button>Multiversion Timestamp Ordering Concurrency Control</button>
                </Link>
            </div>
        </>
    )
}
