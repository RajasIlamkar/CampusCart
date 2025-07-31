// src/pages/EditProduct.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import styles from '../styles/EditProduct.module.css';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            price: data.price || '',
            image: null,
          });
          setPreviewImage(`${process.env.REACT_APP_URL}/${data.imageUrl}`);
        } else {
          setError('Product not found');
        }
      })
      .catch(() => setError('Failed to load product'));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = new FormData();
    body.append('title', formData.title);
    body.append('description', formData.description);
    body.append('price', formData.price);
    if (formData.image) body.append('image', formData.image);

    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body,
    });

    if (res.ok) {
      navigate('/my-listings');
    } else {
      const data = await res.json();
      setError(data.msg || 'Update failed');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Edit Product</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className={styles.textarea}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Image</label>
          {previewImage && <img src={previewImage} alt="Preview" className={styles.previewImage} />}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>Update Product</button>
      </form>
    </div>
  );
}
