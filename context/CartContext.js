"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("tourCart");
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Error loading cart:", e);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tourCart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      // Check if item already exists in cart
      const exists = prev.find(
        (cartItem) =>
          cartItem.tourId === item.tourId &&
          cartItem.selectedDate === item.selectedDate &&
          cartItem.transferOption === item.transferOption
      );

      if (exists) {
        // Update existing item
        return prev.map((cartItem) =>
          cartItem.tourId === item.tourId &&
          cartItem.selectedDate === item.selectedDate &&
          cartItem.transferOption === item.transferOption
            ? { ...item, id: cartItem.id }
            : cartItem
        );
      } else {
        // Add new item with unique ID
        return [...prev, { ...item, id: Date.now().toString() }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateCartItem = (itemId, updates) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const tourTotal = parseFloat(item.totalAmount || 0);
      // Calculate addons total
      const addonsTotal = item.selectedAddons ? Object.keys(item.selectedAddons).reduce((sum, addonId) => {
        const addon = item.selectedAddons[addonId];
        if (addon && addon.selected) {
          return sum + ((addon.adult || 0) * (addon.adultPrice || 0)) + ((addon.child || 0) * (addon.childPrice || 0));
        }
        return sum;
      }, 0) : 0;
      return total + tourTotal + addonsTotal;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

