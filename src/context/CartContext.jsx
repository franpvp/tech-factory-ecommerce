// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 🆕 ID del carrito devuelto por ms-ordenes
  const [carritoId, setCarritoId] = useState(null);

  // Aumentar cantidad
  const increaseQuantity = (idProducto) => {
    setCart((prev) =>
      prev.map((item) =>
        item.idProducto === idProducto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  // Disminuir cantidad
  const decreaseQuantity = (idProducto) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.idProducto === idProducto
            ? { ...item, cantidad: Math.max(1, item.cantidad - 1) }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // Agregar producto
  const addToCart = (producto) => {
    setCart((prev) => {
      const existente = prev.find((p) => p.idProducto === producto.idProducto);

      if (existente) {
        return prev.map((p) =>
          p.idProducto === producto.idProducto
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Eliminar
  const deleteFromCart = (idProducto) => {
    setCart((prev) => prev.filter((p) => p.idProducto !== idProducto));
  };

  // Vaciar carrito
  const clearCart = () => setCart([]);

  // Total unidades
  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // Total en $
  const total = useMemo(
    () => cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        deleteFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,

        // 🆕 Totales
        cartCount,
        total,

        // 🆕 Carrito en BD
        carritoId,
        setCarritoId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);