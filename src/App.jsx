import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OptimisticConcurencyControl from './pages/OptimisticConcurrencyControl';
import TwoPhaseLocking from './pages/TwoPhaseLocking';
import MVCC from './pages/MVCC';
import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/two-phase-locking" element={<TwoPhaseLocking/>} />
        <Route path="/optimistic-concurrency-control" element={<OptimisticConcurencyControl/>} />
        <Route path="/mvcc" element={<MVCC/>} />
      </Routes>
    </Router>
  );
}

export default App;
