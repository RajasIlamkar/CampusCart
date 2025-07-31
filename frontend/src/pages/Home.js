import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import styles from '../styles/ProductStyles.module.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const hostel = searchParams.get('hostel') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (hostel) params.set('hostel', hostel);
    if (sort) params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    fetch(`${process.env.REACT_APP_URL}/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(setProducts);
  }, [search, category, hostel, sort, minPrice, maxPrice]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  return (
    <div className={styles.container}>
      {/* <h2 className={styles.heading}>Available Items</h2> */}

      <div className={styles.filterContainer}>

        <select onChange={e => updateFilter('hostel', e.target.value)} value={hostel}>
          <option value="">All Hostels</option>
          <option value="A">Hostel A</option>
          <option value="B">Hostel B</option>
          <option value="C">Hostel C</option>
          <option value="D">Hostel D</option>
          <option value="E">Hostel E</option>
          <option value="FRF">Hostel FRF</option>
          <option value="G">Hostel G</option>
          <option value="H">Hostel H</option>
          <option value="I">Hostel I</option>
          <option value="J">Hostel J</option>
          <option value="K">Hostel K</option>
          <option value="L">Hostel L</option>
          <option value="M">Hostel M</option>
          <option value="N">Hostel N</option>
          <option value="O">Hostel O</option>
          <option value="PG">Hostel PG</option>
          <option value="Q">Hostel Q</option>
        </select>

        <select onChange={e => updateFilter('sort', e.target.value)} value={sort}>
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="date_desc">Newest First</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => updateFilter('minPrice', e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => updateFilter('maxPrice', e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {products.length
          ? products.map(p => <ProductCard key={p._id} product={p} />)
          : <p>No items found.</p>}
      </div>
    </div>
  );
}
