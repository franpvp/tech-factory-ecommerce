import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const listaDetalle = useMemo(() => {
  return cart.map((item) => ({
    idProducto: item.idProducto,
    cantidad: item.cantidad
  }));
}, [cart]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const [carritoId, setCarritoId] = useState(() => {
    try {
      const saved = localStorage.getItem("carritoId");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("carritoId", JSON.stringify(carritoId));
  }, [carritoId]);

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

  // Agregar producto al carrito
  const addToCart = (producto) => {
    const id = producto.idProducto ?? producto.id;

    if (!id) {
      return;
    }

    setCart((prev) => {
      const existente = prev.find((p) => p.idProducto === id);

      if (existente) {
        return prev.map((p) =>
          p.idProducto === id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      }

      return [
        ...prev,
        {
          idProducto: id,
          nombre: producto.nombre ?? "",
          precio: producto.precio ?? 0,
          imagenUrl: producto.imagenUrl ?? "",
          cantidad: 1,
        },
      ];
    });
  };

  // ❌ Eliminar un producto
  const deleteFromCart = (idProducto) => {
    setCart((prev) => prev.filter((p) => p.idProducto !== idProducto));
  };

  // 🧹 Vaciar carrito completo
  const clearCart = () => {
    setCart([]);
    setCarritoId(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("carritoId");
  };

  // Total de unidades
  const cartCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // Total en dinero
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
        cartCount,
        total,
        carritoId,
        setCarritoId,
        listaDetalle
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);