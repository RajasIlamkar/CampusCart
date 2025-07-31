// src/pages/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/ProductDetails.module.css';
import ChatBox from '../components/ChatBox'; // adjust path as necessary


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <p style={{ padding: '2rem' }}>Loading...</p>;

  const date = new Date(product.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={styles.container}>
      <div className={styles.productCard}>
        <img
          src={`${process.env.REACT_APP_URL}/${product.imageUrl}`}
          alt={product.title}
          className={styles.image}
        />
        <div className={styles.info}>
          <h2>{product.title}</h2>
          <p className={styles.price}>₹{product.price}</p>
          <p className={styles.date}>Posted on: {date}</p>
          <p className={styles.desc}>{product.description}</p>
        </div>
      </div>

  <div className={styles.sellerCard}>
  <h3>Seller Information</h3>
  <p><strong>Name:</strong> {product.user.name}</p>
  <p><strong>Hostel:</strong> {product.user.hostel}</p>
  <p><strong>Phone:</strong> {product.user.phoneNo}</p>

  {/* Show ChatBox only if user is logged in and not the seller */}
  {localStorage.getItem('user') &&
    JSON.parse(localStorage.getItem('user'))._id !== product.user._id && (
      <ChatBox
        currentUser={JSON.parse(localStorage.getItem('user'))._id}
        targetUser={product.user._id}
      />
  )}
</div>


    </div>
  );
}
