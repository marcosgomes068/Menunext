'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/contexts/MenuContext';

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customizations: CartCustomization[];
  notes?: string;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  addToCart: (product: Product, quantity: number, customizations: CartCustomization[], notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateCustomizations: (itemId: string, customizations: CartCustomization[]) => void;
  updateNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  generateWhatsAppMessage: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const calculateItemPrice = (product: Product, customizations: CartCustomization[]): number => {
    const customizationPrice = customizations.reduce((sum, custom) => sum + custom.price, 0);
    return product.price + customizationPrice;
  };

  const addToCart = (product: Product, quantity: number, customizations: CartCustomization[], notes?: string) => {
    const itemPrice = calculateItemPrice(product, customizations);
    
    // Verificar se já existe um item idêntico (mesmo produto, mesmas personalizações)
    const existingItemIndex = items.findIndex(item => 
      item.product.id === product.id &&
      JSON.stringify(item.customizations) === JSON.stringify(customizations) &&
      item.notes === notes
    );

    if (existingItemIndex >= 0) {
      // Se existe, apenas aumenta a quantidade
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * itemPrice;
      setItems(updatedItems);
    } else {
      // Se não existe, cria um novo item
      const newItem: CartItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        product,
        quantity,
        customizations,
        notes,
        totalPrice: quantity * itemPrice,
      };
      setItems(prev => [...prev, newItem]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const itemPrice = calculateItemPrice(item.product, item.customizations);
        return {
          ...item,
          quantity,
          totalPrice: quantity * itemPrice,
        };
      }
      return item;
    }));
  };

  const updateCustomizations = (itemId: string, customizations: CartCustomization[]) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const itemPrice = calculateItemPrice(item.product, customizations);
        return {
          ...item,
          customizations,
          totalPrice: item.quantity * itemPrice,
        };
      }
      return item;
    }));
  };

  const updateNotes = (itemId: string, notes: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const generateWhatsAppMessage = (): string => {
    if (items.length === 0) return '';

    let message = '🛒 *Meu Pedido:*\n\n';
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Quantidade: ${item.quantity}\n`;
      message += `   Preço unitário: R$ ${(item.totalPrice / item.quantity).toFixed(2)}\n`;
      
      if (item.customizations.length > 0) {
        message += `   Personalizações:\n`;
        item.customizations.forEach(custom => {
          message += `   • ${custom.name} (+R$ ${custom.price.toFixed(2)})\n`;
        });
      }
      
      if (item.notes) {
        message += `   Observações: ${item.notes}\n`;
      }
      
      message += `   Subtotal: R$ ${item.totalPrice.toFixed(2)}\n\n`;
    });

    message += `*Total do Pedido: R$ ${totalPrice.toFixed(2)}*\n\n`;
    message += '📍 Gostaria de fazer este pedido, por favor!';

    return encodeURIComponent(message);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      isOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCustomizations,
      updateNotes,
      clearCart,
      openCart,
      closeCart,
      generateWhatsAppMessage,
    }}>
      {children}
    </CartContext.Provider>
  );
};
