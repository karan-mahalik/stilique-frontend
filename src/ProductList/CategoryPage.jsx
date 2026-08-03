import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import FilterCategory from '../ProductList/FilterCategory';
import { getFavourites, toggleFavourite } from '../utils/favourites';
import './CategoryPage.css';

// Load all images
const rawImages = import.meta.glob('/src/assets/CategoryImage/*.{jpg,jpeg,png}', { eager: true });
const images = Object.entries(rawImages).reduce((acc, [path, mod]) => {
  const filename = path.split('/').pop();
  acc[filename] = mod.default;
  return acc;
}, {});

const rawAccImages = import.meta.glob('/src/assets/AccImage/*.{jpg,jpeg,png}', { eager: true });
const accImages = Object.entries(rawAccImages).reduce((acc, [path, module]) => {
  const filename = path.split('/').pop();
  acc[filename] = module.default;
  return acc;
}, {});

const priceRanges = [
  { label: 'Under ₹1000', test: price => price < 1000 },
  { label: '₹1000 - ₹5000', test: price => price >= 1000 && price <= 5000 },
  { label: 'Above ₹5000', test: price => price > 5000 },
];

const subCategoriesMap = {
  men: ["Men's Kurta Set", 'Kurta Jacket Sets', "Groom's Sherwani", 'Tuxedo', 'Indo-western'],
  women: ['Sarees', 'Lehengas', 'Gowns', 'Kurtis', 'Co-ord Sets'],
  kids: ['Ethnic Wear', 'Western Wear', 'Kurta Pajama', 'Frocks', 'Gown Sets'],
  unisex: [
    'Unisex Kurta Sets', 'Couple Ethnic Sets', 'Unisex Co-ord Sets',
    'Unisex Jackets', 'Indo-western Wear', 'Sherwani Style Robes',
    'Special Co-ords', 'Nehru Jackets'
  ]
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [likedIds, setLikedIds] = useState(getFavourites());
  const [loading, setLoading] = useState(true);

  const [selectedFilters, setSelectedFilters] = useState({
    price: [], subCategory: [], color: [], size: [],
    pattern: [], occasion: [], embellishment: []
  });

  const getProductImage = (product) => images[product.imageName] || accImages[product.image] || '';

  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => {
      const isSelected = prev[type].includes(value);
      const updated = isSelected
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updated };
    });
  };



  const handleShare = (product) => {
    const url = `${window.location.origin}/category-product/${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url
      });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(product.title + '\n' + url)}`, '_blank');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);

    if (categoryName.toLowerCase() === 'accessories') {
      try {
        const res = await fetch('https://stilique-backend-production.up.railway.app/api/accessories');
        const data = await res.json();
        setAllProducts(data);
      } catch (error) {
        console.error("Failed to fetch accessories", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    const endpoints = {
      men: 'https://stilique-backend-production.up.railway.app/api/men',
      women: 'https://stilique-backend-production.up.railway.app/api/women',
      kids: 'https://stilique-backend-production.up.railway.app/api/kids',
      unisex: 'https://stilique-backend-production.up.railway.app/api/unisex'
    };

    try {
      const url = endpoints[categoryName.toLowerCase()];
      const res = await fetch(url);
      const data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.error(`Failed to fetch ${categoryName} products, error`);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };
  const applyFilters = () => {
    let results = [...allProducts];

    const filterMap = {
      price: p => selectedFilters.price.some(label =>
        priceRanges.find(r => r.label === label)?.test(p.price)
      ),
      subCategory: p => selectedFilters.subCategory.includes(p.subCategory),
      color: p => selectedFilters.color.includes(p.color),
      size: p => selectedFilters.size.includes(p.size),
      pattern: p => selectedFilters.pattern.includes(p.pattern),
      occasion: p => selectedFilters.occasion.includes(p.occasion),
      embellishment: p => selectedFilters.embellishment.includes(p.embellishment),
    };

    Object.keys(filterMap).forEach(type => {
      if (selectedFilters[type].length > 0) {
        results = results.filter(filterMap[type]);
      }
    });

    setFilteredProducts(results);
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryName]);

  useEffect(() => {
    applyFilters();
  }, [allProducts, selectedFilters]);

  useEffect(() => {
    const handler = () => setLikedIds(getFavourites());
    window.addEventListener('likedCountUpdated', handler);
    return () => window.removeEventListener('likedCountUpdated', handler);
  }, []);

  const renderFilterSection = () => (
    <aside className="filter-section">
      <h3>FILTERS</h3>

      <FilterCategory title="Price">
        {priceRanges.map(({ label }) => (
          <label key={label}>
            <input
              type="checkbox"
              checked={selectedFilters.price.includes(label)}
              onChange={() => handleFilterChange('price', label)}
            />
            {label}
          </label>
        ))}
      </FilterCategory>

      <FilterCategory title="Sub Categories">
        {(subCategoriesMap[categoryName.toLowerCase()] || []).map(sub => (
          <label key={sub}>
            <input
              type="checkbox"
              checked={selectedFilters.subCategory.includes(sub)}
              onChange={() => handleFilterChange('subCategory', sub)}
            />
            {sub}
          </label>
        ))}
      </FilterCategory>

      <FilterCategory title="Color">
        {['Red', 'Blue', 'Gold', 'Black', 'Pink', 'Violet', 'Lavender',
          'Brown', 'Yellow', 'Orange', 'White', 'Beige', 'Cream', 'Grey',
          'Purple', 'Peach', 'Maroon', 'Green', 'Ivory'].map(color => (
            <label key={color}>
              <input
                type="checkbox"
                checked={selectedFilters.color.includes(color)}
                onChange={() => handleFilterChange('color', color)}
              />
              {color}
            </label>
          ))}
      </FilterCategory>

      <FilterCategory title="Size">
        {['S', 'M', 'L', 'XL', 'XXL', 'Free'].map(size => (
          <label key={size}>
            <input
              type="checkbox"
              checked={selectedFilters.size.includes(size)}
              onChange={() => handleFilterChange('size', size)}
            />
            {size}
          </label>
        ))}
      </FilterCategory>

      <FilterCategory title="Print & Patterns">
        {['Print', 'Floral', 'Jaipuri', 'Block Print', 'Viscose Rayon'].map(pat => (
          <label key={pat}>
            <input
              type="checkbox"
              checked={selectedFilters.pattern.includes(pat)}
              onChange={() => handleFilterChange('pattern', pat)}
            />
            {pat}
          </label>
        ))}
      </FilterCategory>

      <FilterCategory title="Occasion">
        {['Wedding', 'Festive', 'Haldi', 'Mehendi', 'Sangeet', 'Reception', 'Pooja', 'Casual'].map(occ => (
          <label key={occ}>
            <input
              type="checkbox"
              checked={selectedFilters.occasion.includes(occ)}
              onChange={() => handleFilterChange('occasion', occ)}
            />
            {occ}
          </label>
        ))}
      </FilterCategory>

      <FilterCategory title="Embellishment">
        {['Resham Work', 'Sequins Work', 'Cutdana', 'Mirror Work', 'Pearl Work',
          'Stone Work', 'Thread Work', 'Zari Work', 'Leather Work'].map(e => (
            <label key={e}>
              <input
                type="checkbox"
                checked={selectedFilters.embellishment.includes(e)}
                onChange={() => handleFilterChange('embellishment', e)}
              />
              {e}
            </label>
          ))}
      </FilterCategory>
    </aside>
  );

  const renderProductGrid = () => (
    <div className="product-grid">
      {filteredProducts.map(product => (
        <div
          key={product.id}
          className="product-card"
          onClick={() => navigate(`/category-product/${product.id}`)}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <img className="product-img" src={getProductImage(product)} alt={product.title} />
          <h3>{product.name}</h3>
          <div className="icon-stack" style={{
            position: 'absolute', top: 11, right: 18, display: 'flex',
            flexDirection: 'column', alignItems: 'flex-end', gap: 6, zIndex: 2
          }}>
            <FaHeart
              className="like-icon"
              color={likedIds.includes(product.id) ? 'red' : 'gray'}
              style={{
                background: 'black', borderRadius: '50%',
                padding: 6, fontSize: 22, cursor: 'pointer'
              }}
              onClick={(e) => handleLike(e, product)}
            />
            <FaShareAlt
              className="share-icon"
              style={{
                background: 'black', borderRadius: '50%',
                padding: 6, fontSize: 22, cursor: 'pointer'
              }}
              onClick={e => {
                e.stopPropagation();
                handleShare(product);
              }}
              title="Share"
            />
          </div>
          <h3>{product.title}</h3>
          <p>₹{product.price}</p>
        </div>
      ))}
      {!loading && filteredProducts.length === 0 && (
        <p>No products found for selected filters in {categoryName}</p>
      )}
    </div>
  );


  const handleLike = async (e, product) => {
    console.log("Heart clicked");

    e.stopPropagation();

    toggleFavourite(product.id);
    setLikedIds(getFavourites());

    try {
      await axios.post(
        "https://stilique-backend-production.up.railway.app/api/likes",
        {
          userId: 1,
          productId: product.id
        }
      );

      console.log("Like saved");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="category-page">
      <h2>{categoryName.toUpperCase()} COLLECTION</h2>
      <div className="category-layout">
        {renderFilterSection()}
        {loading ? <p>Loading...</p> : renderProductGrid()}
      </div>
    </div>
  );
};

export default CategoryPage;