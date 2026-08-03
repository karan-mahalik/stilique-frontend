
// // src/Context/CartContext.jsx
// import React, { createContext, useContext, useEffect, useState } from 'react';

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//     const [cartItems, setCartItems] = useState(() => {
//         const savedCart = localStorage.getItem('cartItems');
//         return savedCart ? JSON.parse(savedCart) : [];
//     });

//     useEffect(() => {
//         localStorage.setItem('cartItems', JSON.stringify(cartItems));
//     }, [cartItems]);

//     // ✅ Add to cart (with quantity initialization)
//     const addToCart = (item) => {
//         setCartItems((prev) => {
//             const existing = prev.find((p) => p.id === item.id);
//             if (existing) {
//                 return prev.map((p) =>
//                     p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
//                 );
//             } else {
//                 return [...prev, { ...item, quantity: 1 }];
//             }
//         });
//     };

//     // ✅ Remove item from cart
//     const removeFromCart = (id) => {
//         setCartItems((prev) => prev.filter((item) => item.id !== id));
//     };

//     // ✅ Update quantity (+/-)
//     const updateQuantity = (id, delta) => {
//         setCartItems((prev) =>
//             prev.map((item) =>
//                 item.id === id
//                     ? { ...item, quantity: Math.max(1, item.quantity + delta) }
//                     : item
//             )
//         );
//     };

//     return (
//         <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
//             {children}
//         </CartContext.Provider>
//     );
// };







// src/Context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const userId = 1; // Replace this with real authenticated userId later

  const fetchCart = async () => {
    try {
      const res = await axios.get(`https://stilique-backend-production.up.railway.app/api/cart/${userId}`);
      setCartItems(res.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      const existing = cartItems.find((item) => item.productId === product.id);
      if (existing) {
        await axios.put(`https://stilique-backend-production.up.railway.app/api/cart/update`, {
          ...existing,
          quantity: existing.quantity + 1,
        });
      } else {
        await axios.post(`https://stilique-backend-production.up.railway.app/api/cart/add`, {
          userId,
          productId: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity: 1,
        });
      }
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`https://stilique-backend-production.up.railway.app/api/cart/remove/${id}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateQuantity = async (id, delta) => {
    try {
      const item = cartItems.find((item) => item.id === id);
      if (!item) return;

      const updatedQuantity = Math.max(1, item.quantity + delta);
      await axios.put(`https://stilique-backend-production.up.railway.app/api/cart/update`, {
        ...item,
        quantity: updatedQuantity,
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};




