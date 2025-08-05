'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { Product } from '@/contexts/MenuContext';
import { useCart, CartCustomization } from '@/contexts/CartContext';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<CartCustomization[]>([]);
  const [notes, setNotes] = useState('');

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedCustomizations([]);
      setNotes('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleCustomizationChange = (customization: { id: string; name: string; price: number }, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCustomizations(prev => [...prev, {
        id: customization.id,
        name: customization.name,
        price: customization.price
      }]);
    } else {
      setSelectedCustomizations(prev => 
        prev.filter(item => item.id !== customization.id)
      );
    }
  };

  const calculateTotalPrice = () => {
    const customizationPrice = selectedCustomizations.reduce((sum, custom) => sum + custom.price, 0);
    return (product.price + customizationPrice) * quantity;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedCustomizations, notes || undefined);
    onClose();
  };

  const requiredCustomizations = product.customizations?.filter(c => c.type === 'required') || [];
  const optionalCustomizations = product.customizations?.filter(c => c.type === 'optional') || [];
  
  // Check if all required customizations are selected
  const allRequiredSelected = requiredCustomizations.every(req =>
    selectedCustomizations.some(sel => sel.id === req.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {product.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Product Image */}
            {product.imageUrl && (
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <NextImage
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Product Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
              )}
              <p className="text-2xl font-bold text-green-600">
                R$ {product.price.toFixed(2)}
              </p>
            </div>

            {/* Required Customizations */}
            {requiredCustomizations.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Personalizações Obrigatórias
                </h4>
                <div className="space-y-2">
                  {requiredCustomizations.map((customization) => (
                    <label
                      key={customization.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCustomizations.some(c => c.id === customization.id)}
                          onChange={(e) => handleCustomizationChange(customization, e.target.checked)}
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="font-medium text-gray-900">
                          {customization.name}
                        </span>
                      </div>
                      <span className="text-green-600 font-medium">
                        +R$ {customization.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Customizations */}
            {optionalCustomizations.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Personalizações Opcionais
                </h4>
                <div className="space-y-2">
                  {optionalCustomizations.map((customization) => (
                    <label
                      key={customization.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCustomizations.some(c => c.id === customization.id)}
                          onChange={(e) => handleCustomizationChange(customization, e.target.checked)}
                          className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="font-medium text-gray-900">
                          {customization.name}
                        </span>
                      </div>
                      <span className="text-green-600 font-medium">
                        +R$ {customization.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-3">
                Observações (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alguma observação especial para este item?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              {/* Quantity */}
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900">Quantidade:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <MinusIcon className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="text-right">
                <p className="text-sm text-gray-600">Total:</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {calculateTotalPrice().toFixed(2)}
                </p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!allRequiredSelected}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                allRequiredSelected
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!allRequiredSelected 
                ? 'Selecione todas as opções obrigatórias'
                : `Adicionar ao Carrinho - R$ ${calculateTotalPrice().toFixed(2)}`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
