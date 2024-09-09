import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import SignIn from './pages/SignIn';
import Register from './pages/SignUp';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import AssignJobs from './pages/AssignJobs';

const App = () => {
  const [userId, setUserId] = useState(localStorage.getItem('userId')); // Initialize from localStorage

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  console.log("app.js userId", userId);

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<SignIn setUserId={setUserId} />} />
          <Route path="/SignIn" element={<SignIn setUserId={setUserId} />} />
          <Route path="/SignUp" element={<Register />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage userId={userId} />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout userId={userId} />
              </PrivateRoute>
            }
          />
          <Route
            path="/AssignJobs"
            element={
              <PrivateRoute>
                <AssignJobs />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;