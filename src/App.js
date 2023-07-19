import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RecordsPage from './pages/RecordsPage';
import CalculatorPage from './pages/CalculatorPage';
import RandomStringPage from './pages/RandomStringPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

function App() {
  document.title = 'TrueNorth App'
  const token = localStorage.getItem('token');
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(token));

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <div className='container'>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage />} />
            {isLoggedIn && (
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/records" element={<RecordsPage />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/random-string" element={<RandomStringPage />} />
              </Route>
            )}
            {!isLoggedIn && <Route path="*" element={<Navigate to="/login" replace />} />}
          </Routes>
        </Router>
        <ToastContainer />
      </div>
    </div>
  );
}

export default App;
