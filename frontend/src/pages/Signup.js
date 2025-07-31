import React, { useState } from 'react';
import { setToken } from '../utils/auth';
import styles from '../styles/AuthForm.module.css';
import { Link } from 'react-router-dom';

export default function Signup({ onSignup }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNo: '',
    hostel: '',
    year: '',
    rollNo: ''
  });

  const [error, setError] = useState('');

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`${process.env.REACT_APP_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onSignup();
    } else {
      setError(data.msg || 'Signup failed');
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>Signup</h2>
        {error && <p className={styles.error}>{error}</p>}

        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Password', name: 'password', type: 'password' },
          { label: 'Phone Number', name: 'phoneNo', type: 'text' },
          { label: 'Hostel', name: 'hostel', type: 'text' },
          { label: 'Year', name: 'year', type: 'text' },
          { label: 'Roll No.', name: 'rollNo', type: 'text' },
        ].map(({ label, name, type }) => (
          <div className={styles.inputGroup} key={name}>
            <label htmlFor={name} className={styles.label}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
        ))}

        <button type="submit" className={styles.button}>Signup</button>

        <p className={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
