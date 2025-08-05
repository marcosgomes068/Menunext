'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  customizations?: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  price: number;
  type: 'required' | 'optional';
}

export interface Category {
  id: string;
  name: string;
  displayOrder: number;
}

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
}

export interface MenuSettings {
  businessName: string;
  logoUrl: string;
  whatsappNumber: string;
  primaryColor: string;
  secondaryColor: string;
  isOpen: boolean;
  openingMessage: string;
  closedMessage: string;
}

interface MenuContextType {
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
  settings: MenuSettings;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addPromotion: (promotion: Promotion) => void;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  updateSettings: (settings: Partial<MenuSettings>) => void;
  getProductsByCategory: (categoryId: string) => Product[];
  getActivePromotions: () => Promotion[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<MenuSettings>({
    businessName: 'Menu Digital',
    logoUrl: '/logo.svg',
    whatsappNumber: '5511999999999',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    isOpen: true,
    openingMessage: '🟢 Estamos Abertos!',
    closedMessage: '🔴 Estamos Fechados',
  });

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('menuSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({ ...prevSettings, ...parsedSettings }));
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    }
  }, []);

  // Salvar configurações no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem('menuSettings', JSON.stringify(settings));
  }, [settings]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Lanches', displayOrder: 1 },
    { id: '2', name: 'Bebidas', displayOrder: 2 },
    { id: '3', name: 'Sobremesas', displayOrder: 3 },
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'X-Burguer',
      description: 'Pão, carne, queijo e molho especial.',
      price: 18.90,
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
      categoryId: '1',
      customizations: [
        { id: '1', name: 'Bacon', price: 3.00, type: 'optional' },
        { id: '2', name: 'Queijo Extra', price: 2.50, type: 'optional' },
      ],
    },
    {
      id: '2',
      name: 'X-Salada',
      description: 'Pão, carne, queijo, alface, tomate e maionese.',
      price: 20.00,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
      categoryId: '1',
    },
    {
      id: '3',
      name: 'Coca-Cola',
      description: 'Refrigerante 350ml',
      price: 5.00,
      categoryId: '2',
    },
    {
      id: '4',
      name: 'Açaí 300ml',
      description: 'Açaí puro 300ml',
      price: 12.00,
      categoryId: '3',
      customizations: [
        { id: '3', name: 'Amendoim', price: 2.00, type: 'optional' },
        { id: '4', name: 'Leite em Pó', price: 2.00, type: 'optional' },
        { id: '5', name: 'Granola', price: 1.50, type: 'optional' },
        { id: '6', name: 'Banana', price: 1.00, type: 'optional' },
      ],
    },
  ]);

  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      title: 'Combo Especial',
      description: 'X-Burguer + Batata + Refrigerante por apenas R$ 25,90',
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      displayOrder: 1,
    },
    {
      id: '2',
      title: 'Açaí Completo',
      description: 'Açaí 500ml com 3 adicionais de sua escolha',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      displayOrder: 2,
    },
  ]);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setProducts(products.filter(p => p.categoryId !== id));
  };

  const updateSettings = (newSettings: Partial<MenuSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId);
  };

  // Funções para gerenciar promoções
  const addPromotion = (promotion: Promotion) => {
    setPromotions([...promotions, promotion]);
  };

  const updatePromotion = (id: string, updatedPromotion: Partial<Promotion>) => {
    setPromotions(promotions.map(p => p.id === id ? { ...p, ...updatedPromotion } : p));
  };

  const deletePromotion = (id: string) => {
    setPromotions(promotions.filter(p => p.id !== id));
  };

  const getActivePromotions = () => {
    return promotions.filter(promotion => promotion.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
  };

  return (
    <MenuContext.Provider value={{
      products,
      categories,
      settings,
      promotions,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      updateSettings,
      getProductsByCategory,
      addPromotion,
      updatePromotion,
      deletePromotion,
      getActivePromotions,
    }}>
      {children}
    </MenuContext.Provider>
  );
};
