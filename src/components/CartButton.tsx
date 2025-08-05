'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function CartButton() {
  const { totalItems, totalPrice, openCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex items-center space-x-3 min-w-[60px] group scale-in"
    >
      {/* Cart Icon */}
      <div className="relative">
        <ShoppingCartIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
        {/* Badge */}
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      </div>

      {/* Expanded Info (visible on hover/larger screens) */}
      <div className="hidden md:group-hover:block transition-all duration-300 overflow-hidden">
        <div className="text-left whitespace-nowrap">
          <p className="font-medium text-sm">
            {totalItems} {totalItems === 1 ? 'item' : 'itens'}
          </p>
          <p className="text-xs opacity-90">
            R$ {totalPrice.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Ripple Effect */}
      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
    </button>
  );
}
