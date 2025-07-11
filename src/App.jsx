import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GuestList from './components/GuestList';
import SearchGuestPage from './components/SearchGuestPage'; // 追加

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guests" element={<GuestList />} />
        <Route path="/search" element={<SearchGuestPage />} /> {/* 追加 */}
      </Routes>
    </Router>
  );
};

export default App;