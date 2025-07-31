import React, { useState } from 'react';
import { setToken } from '../utils/auth';
import styles from '../styles/AuthForm.module.css';
import { Link } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(`${process.env.REACT_APP_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setToken(data.token);
       localStorage.setItem('user', JSON.stringify(data.user));
      onLogin();
    } else {
      setError(data.msg || 'Login failed');
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>Login</h2>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>Login</button>

        <p className={styles.link}>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
