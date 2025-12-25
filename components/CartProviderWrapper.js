"use client";
import { CartProvider } from "@/context/CartContext";

export default function CartProviderWrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

