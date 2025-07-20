import React, { useState} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateProduct from './pages/CreateProduct';
import ProductDetails from './pages/ProductDetails';
import MyListings from './pages/MyListings';
import EditProduct from './pages/EditProduct';
import ProfilePage from './pages/ProfilePage'; // 👈 import this at the top

import { isLoggedIn } from './utils/auth';


export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Header loggedIn={loggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!loggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!loggedIn ? <Signup onSignup={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/create" element={loggedIn ? <CreateProduct /> : <Navigate to="/login" />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/profile" element={loggedIn ? <ProfilePage /> : <Navigate to="/login" />} />



      </Routes>
    </BrowserRouter>
  );
}

