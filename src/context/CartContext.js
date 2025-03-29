import React, { createContext, useState, useContext } from 'react';

// Criação do contexto
const CartContext = createContext();

// Hook personalizado para usar o contexto
export const useCart = () => useContext(CartContext);

// Provedor do contexto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Adicionar um produto ao carrinho
  const addToCart = (product, quantity = 1) => {
    setCartItems(currentItems => {
      // Verificar se o produto já está no carrinho
      const existingItemIndex = currentItems.findIndex(
        item => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Se o produto já existe, atualizar a quantidade
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Se o produto não existe, adicionar ao carrinho
        return [...currentItems, { product, quantity }];
      }
    });
  };

  // Remover um produto do carrinho
  const removeFromCart = (productId) => {
    setCartItems(currentItems => 
      currentItems.filter(item => item.product.id !== productId)
    );
  };

  // Atualizar a quantidade de um produto no carrinho
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(currentItems => 
      currentItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Limpar o carrinho
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular o total do carrinho
  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  };

  // Valores e funções expostos pelo contexto
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
