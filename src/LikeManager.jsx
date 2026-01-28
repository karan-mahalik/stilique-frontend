// import React, { useState } from 'react';
// import { FaHeart, FaShareAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import mockData from './data/mockData';
// import mockDataWomen from './data/mockDataWomen';
// import mockDataMen from './data/mockDataMen';
// import mockDataKids from './data/mockDataKids';
// import mockDataUnisex from './data/mockDataUnisex';
// import mockDataAccessories from './data/mockDataAcc';
// import './LikeManager.css';

// // Import images from all folders
// const imageModules = import.meta.glob('./assets/Image/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });
// const categoryImageModules = import.meta.glob('./assets/CategoryImage/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });
// const accImageModules = import.meta.glob('./assets/AccImage/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

// const imageMap = {};
// Object.keys(imageModules).forEach((path) => {
//   const fileName = path.split('/').pop();
//   imageMap[fileName] = imageModules[path];
// });
// Object.keys(categoryImageModules).forEach((path) => {
//   const fileName = path.split('/').pop();
//   if (!imageMap[fileName]) imageMap[fileName] = categoryImageModules[path];
// });
// Object.keys(accImageModules).forEach((path) => {
//   const fileName = path.split('/').pop();
//   if (!imageMap[fileName]) imageMap[fileName] = accImageModules[path];
// });

// const LikeManager = ({ asPage = false }) => {
//   const [liked, setLiked] = useState(() => {
//     const stored = localStorage.getItem('likedProducts');
//     return stored ? JSON.parse(stored) : [];
//   });

//   const navigate = useNavigate();

//   const toggleLike = (id) => {
//     const updatedLikes = liked.includes(id)
//       ? liked.filter((itemId) => itemId !== id)
//       : [...liked, id];
//     setLiked(updatedLikes);
//     localStorage.setItem('likedProducts', JSON.stringify(updatedLikes));
//     window.dispatchEvent(
//       new CustomEvent('likedCountUpdated', { detail: updatedLikes.length })
//     );
//   };

//   // Combine all products including accessories
//   const allMockData = [
//     ...mockData,
//     ...mockDataWomen,
//     ...mockDataMen,
//     ...mockDataKids,
//     ...mockDataUnisex,
//     ...mockDataAccessories,
//   ];

//   const filteredData = asPage
//     ? allMockData.filter((item) => liked.includes(item.id))
//     : allMockData;

//   // Get correct image for each product
//   const getProductImage = (item) => {
//     // Accessories use 'image', others use 'imageName'
//     return imageMap[item.image || item.imageName] || '';
//   };

//   const handleBuyNow = (item) => {
//     navigate('/checkout', { state: { product: item } });
//   };

//   return (
//     <div className="like-grid">
//       {asPage && filteredData.length === 0 ? (
//         <div className="empty-like-msg">
//           <h2>No Favourites Yet</h2>
//           <p className='para'>Looks like you haven't liked anything yet.</p>
//           <button onClick={() => window.location.href = '/'} className="discover-btn">
//             Discover Beautiful Styles
//           </button>
//         </div>
//       ) : (
//         filteredData.map((item) => (
//           <div className="like-card category-style" key={item.id}>
//             <img
//               src={getProductImage(item)}
//               alt={item.title || item.name}
//               className="like-image"
//             />
//             <div className="like-icons">
//               <FaHeart
//                 onClick={() => toggleLike(item.id)}
//                 className={`like-icon ${liked.includes(item.id) ? 'liked' : ''}`}
//               />
//               <FaShareAlt
//                 onClick={() =>
//                   navigator.share?.({
//                     title: item.title || item.name,
//                     text: item.description,
//                     url: window.location.href,
//                   }) || alert('Sharing not supported')
//                 }
//                 className="share-icon"
//               />
//             </div>
//             <div className="like-desc">
//               <div className="like-title">{item.title || item.name}</div>
//               <div className="like-price">₹{item.price}</div>
//               <button className="buy-now-btn" onClick={() => handleBuyNow(item)}>
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default LikeManager;








import React, { useEffect, useState } from 'react';
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import mockData from './data/mockData'; // still needed for Banner.jsx
import './LikeManager.css';

const imageModules = import.meta.glob('./assets/Image/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });
const categoryImageModules = import.meta.glob('./assets/CategoryImage/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });
const accImageModules = import.meta.glob('./assets/AccImage/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

const imageMap = {};
[imageModules, categoryImageModules, accImageModules].forEach((moduleGroup) => {
  Object.entries(moduleGroup).forEach(([path, mod]) => {
    const fileName = path.split('/').pop().toLocaleLowerCase();
    if (!imageMap[fileName]) imageMap[fileName] = mod;
  });
});

const LikeManager = ({ asPage = false }) => {
  const [liked, setLiked] = useState(() => {
    const stored = localStorage.getItem('likedProducts');
    return stored ? JSON.parse(stored) : [];
  });

  const [allData, setAllData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (asPage) {
      // Only fetch when used as full Like Page
      const fetchData = async () => {
        try {
          const urls = [
            'http://localhost:8080/api/men',
            'http://localhost:8080/api/women',
            'http://localhost:8080/api/kids',
            'http://localhost:8080/api/unisex',
            'http://localhost:8080/api/accessories',
          ];
          const results = await Promise.all(urls.map((url) => fetch(url).then((res) => res.json())));
          const combined = results.flat();
          setAllData(combined);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      };
      fetchData();
    }
  }, [asPage]);

  const toggleLike = (id) => {
    const updatedLikes = liked.includes(id)
      ? liked.filter((itemId) => itemId !== id)
      : [...liked, id];
    setLiked(updatedLikes);
    localStorage.setItem('likedProducts', JSON.stringify(updatedLikes));
    window.dispatchEvent(new CustomEvent('likedCountUpdated', { detail: updatedLikes.length }));
  };


    
const filteredData = asPage
  ? allData.filter((item) => liked.includes(item.id))
  : mockData.filter((item) => liked.includes(item.id));
  
  const getProductImage = (item) => {
    return imageMap[(item.image || item.imageName).toLowerCase()] || '';
  };

  const handleBuyNow = (item) => {
    navigate('/checkout', { state: { product: item } });
  };

  return (
    <div className="like-grid">
      {asPage && filteredData.length === 0 ? (
        <div className="empty-like-msg">
          <h2>No Favourites Yet</h2>
          <p className="para">Looks like you haven't liked anything yet.</p>
          <button onClick={() => window.location.href = '/'} className="discover-btn">
            Discover Beautiful Styles
          </button>
        </div>
      ) : (
        filteredData.map((item) => (
          <div className="like-card category-style" key={item.id}>
            <img
              src={getProductImage(item)}
              alt={item.title || item.name}
              className="like-image"
            />
            <div className="like-icons">
              <FaHeart
                onClick={() => toggleLike(item.id)}
                className={`like-icon ${liked.includes(item.id) ? 'liked' : ''}`}
              />
              <FaShareAlt
                onClick={() =>
                  navigator.share?.({
                    title: item.title || item.name,
                    text: item.description,
                    url: window.location.href,
                  }) || alert('Sharing not supported')
                }
                className="share-icon"
              />
            </div>
            <div className="like-desc">
              <div className="like-title">{item.title || item.name}</div>
              <div className="like-price">₹{item.price}</div>
              <button className="buy-now-btn" onClick={() => handleBuyNow(item)}>
                Buy Now
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LikeManager;







