// src/pages/MyListings.js
import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/MyListings.module.css';

export default function MyListings() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/products/my', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else setError(data.msg || 'Failed to fetch');
      });
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    if (res.ok) {
      setProducts(products.filter(p => p._id !== id));
    } else {
      alert('Delete failed');
    }
  }

  return (
   <div className={styles.container}>
  <h2 className={styles.heading}>My Listings</h2>
  {error && <p className={styles.error}>{error}</p>}
  <div className={styles.grid}>
    {products.map(product => (
      <div className={styles.card} key={product._id}>
        <img
          src={`http://localhost:5000/${product.imageUrl}`}
          alt={product.title}
          className={styles.image}
        />
        <div className={styles.title}>{product.title}</div>
        <div className={styles.price}>₹{product.price}</div>
        <div className={styles.buttonGroup}>
          <button onClick={() => navigate(`/edit/${product._id}`)}>Edit</button>
          <button onClick={() => handleDelete(product._id)}>Delete</button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}
