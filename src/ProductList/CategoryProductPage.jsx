import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mockData from '../data/mockData';
import { useCart } from '../Context/CartContext';
import './CategoryPage.css';

// Import all images
const rawImages = import.meta.glob('/src/assets/CategoryImage/*.{jpg,jpeg,png}', { eager: true });
const images = Object.entries(rawImages).reduce((acc, [path, module]) => {
  const filename = path.split('/').pop();
  acc[filename] = module.default;
  return acc;
}, {});

// Import Accessories images
const rawAccImages = import.meta.glob('/src/assets/AccImage/*.{jpg,jpeg,png}', { eager: true });
const accImages = Object.entries(rawAccImages).reduce((acc, [path, module]) => {
  const filename = path.split('/').pop();
  acc[filename] = module.default;
  return acc;
}, {});

const CategoryProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      // Try to find in mockData (used in Banner)
      const localProduct = mockData.find(item => item.id === parseInt(id));
      if (localProduct) {
        setProduct(localProduct);
        setLoading(false);
        return;
      }

      // Try to fetch from Accessories API instead of mockDataAccessories
      try {
        const res = await fetch('http://localhost:8080/api/accessories');
        const data = await res.json();
        const accessoryProduct = data.find(item => parseInt(item.id) === parseInt(id));
        if (accessoryProduct) {
          setProduct(accessoryProduct);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching accessories data:', error);
      }

      // Else try fetching from backend APIs (Men, Women, Kids, Unisex)
      const endpoints = [
        'http://localhost:8080/api/men',
        'http://localhost:8080/api/women',
        'http://localhost:8080/api/kids',
        'http://localhost:8080/api/unisex'
      ];

      for (const url of endpoints) {
        try {
          const res = await fetch(url);
          const data = await res.json();
          const found = data.find((item) => item.id === parseInt(id));
          if (found) {
            setProduct(found);
            break;
          }
        } catch (error) {
          console.error(`Error fetching from ${url}:, error`);
        }
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (product === null && loading) return null;
  if (product === null && !loading) return <p>Product not found</p>;

  const imageKey = product.image || product.imageName;
  const imageSrc = images[imageKey] || accImages[imageKey] || null;
  const isInCart = product && cartItems.some(item => item.id === product.id);

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: imageSrc,
    };
    addToCart(productToAdd);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    if (!isInCart) handleAddToCart();
    navigate('/checkout');
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-image-section">
          {imageSrc ? (
            <img className="product-image" src={imageSrc} alt={product.title} />
          ) : (
            <p>Image not found</p>
          )}
        </div>
        <div className="product-details">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-desc">{product.description}</p>
          <p className="product-price">₹{product.price}</p>
          <div className="product-buttons">
            {isInCart ? (
              <button onClick={() => navigate('/cart')}>Go to Cart</button>
            ) : (
              <button className="cart-btn" onClick={handleAddToCart}>Add to Cart</button>
            )}
            <button className="buy-btn" onClick={handleBuyNow}>Buy Now</button>
          </div>
          <div className="go-back">
            <button onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductPage;