import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { Search } from 'lucide-react'; // Icon from lucide-react

export default function Header({ loggedIn, onLogout }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>CampusCart</Link>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          <Search size={18} />
        </button>
      </form>

      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>Home</Link>
        {loggedIn ? (
          <>
            <Link to="/my-listings" className={styles.link}>My Listings</Link>
            <Link to="/create" className={styles.link}>Sell</Link>
            <Link to="/profile" className={styles.link}>Profile</Link>
            <button onClick={onLogout} className={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>Login</Link>
            <Link to="/signup" className={styles.link}>Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}
