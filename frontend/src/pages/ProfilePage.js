import React, { useEffect, useState } from 'react';
import styles from '../styles/ProfilePage.module.css';
import { getToken } from '../utils/auth';

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    rollNo: '',
    phoneNo: '',
    hostel: '',
    year: '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data) setUserData(data);
        else setError('Failed to load user');
      })
      .catch(() => setError('Could not fetch user'));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    setError('');

    const res = await fetch('http://localhost:5000/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        phoneNo: userData.phoneNo,
        hostel: userData.hostel,
        year: userData.year,
      }),
    });

    if (res.ok) {
      setMsg('Profile updated successfully!');
    } else {
      const data = await res.json();
      setError(data.msg || 'Update failed');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Profile</h2>
      {msg && <p className={styles.success}>{msg}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Name</label>
          <input type="text" value={userData.name} disabled />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input type="email" value={userData.email} disabled />
        </div>

        <div className={styles.field}>
          <label>Roll No</label>
          <input type="text" value={userData.rollNo} disabled />
        </div>

        <div className={styles.field}>
          <label>Phone No</label>
          <input type="text" name="phoneNo" value={userData.phoneNo} onChange={handleChange} />
        </div>

        <div className={styles.field}>
          <label>Hostel</label>
          <input type="text" name="hostel" value={userData.hostel} onChange={handleChange} />
        </div>

        <div className={styles.field}>
          <label>Year</label>
          <input type="number" name="year" value={userData.year} onChange={handleChange} />
        </div>

        <button className={styles.button} type="submit">Update Profile</button>
      </form>
    </div>
  );
}
