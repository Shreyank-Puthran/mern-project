import { createContext, useContext, useEffect, useState } from "react";
import api from "../../../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const getUser = () => JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(getUser());
  const [cartItems, setCartItems] = useState([]);

  const token = user?.token;
  const userId = user?._id;

  // Update user on localStorage change (login/logout)
  useEffect(() => {
    const handleStorage = () => setUser(getUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Fetch cart from backend on login
  // useEffect(() => {
  //   const fetchCart = async () => {
  //     try {
  //       if (!token) return setCartItems([]);
  //       const res = await api.get(`/cart`); // interceptor adds token
  //       setCartItems(res.data.items || []); // <-- Use .items here
  //     } catch (error) {
  //       console.error("Failed to fetch cart:", error);
  //       setCartItems([]);
  //     }
  //   };
  //   fetchCart();
  // }, [token]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!token) {
          // console.log("No token - clearing cart");
          return setCartItems([]);
        }
        const res = await api.get(`/cart`);
        // console.log("Fetched cart from backend:", res.data);
        setCartItems(res.data.items || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCartItems([]);
      }
    };
    fetchCart();
  }, [token]);

  // useEffect(() => {
  //   console.log("Cart items updated:", cartItems);
  // }, [cartItems]);

  const syncCart = async (items) => {
    if (!token) return;

    const transformedItems = items.map((item) => ({
      product: item.product._id, // just the ObjectId
      quantity: item.quantity,
    }));
    // console.log("Syncing to backend:", transformedItems);
    try {
      // await api.put(`/cart`, { items: transformedItems });
      await api.post(`/cart`, { items: transformedItems });
    } catch (error) {
      console.error("Cart sync failed:", error);
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.product._id === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item
        );
      } else {
        updated = [
          ...prev,
          { product, quantity: Math.min(quantity, product.stock) },
        ];
      }
      syncCart(updated); // fire and forget
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.product._id !== productId);
      syncCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (token) {
      api
        .delete(`/cart`)
        .catch((err) => console.error("Failed to clear cart:", err));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        userId,
        setCart: setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
