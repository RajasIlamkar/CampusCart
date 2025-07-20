// src/components/ProductCard.js
import { Link } from 'react-router-dom';
import React from 'react';
import styles from '../styles/ProductStyles.module.css';

export default function ProductCard({ product }) {
  const createdAt = new Date(product.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Link to={`/product/${product._id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img
          src={`http://localhost:5000/${product.imageUrl}`}
          alt={product.title}
          className={styles.image}
        />
        <div className={styles.titleRow}>
          <div className={styles.title}>{product.title}</div>
          <div className={styles.date}>{createdAt}</div>
        </div>
        <div className={styles.price}>₹{product.price}</div>
        <div className={styles.seller}>Seller: {product.user?.name || 'Unknown'}</div>
      </div>
    </Link>
  );
}
