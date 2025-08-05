'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import ProductCarousel from '@/components/ProductCarousel';
import PromotionCarousel from '@/components/PromotionCarousel';
import RestaurantStatus from '@/components/RestaurantStatus';
import Cart from '@/components/Cart';
import CartButton from '@/components/CartButton';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useMenu } from '@/contexts/MenuContext';

export default function HomePage() {
  const { categories, getProductsByCategory, settings } = useMenu();

  // Ordenar categorias por displayOrder
  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar 
        logoUrl={settings.logoUrl}
        businessName={settings.businessName}
        whatsappNumber={settings.whatsappNumber}
        categories={categories}
      />
      
      <RestaurantStatus />
      
      <main className="container mx-auto px-4 py-12 pt-24">
        {/* Promotion Carousel */}
        <section className="mb-16">
          <PromotionCarousel />
        </section>

        {/* Product Categories */}
        <section className="space-y-16">
          {sortedCategories.map((category) => {
            const categoryProducts = getProductsByCategory(category.id);

            return (
              <div key={category.id} id={`category-${category.id}`} className="scroll-mt-20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {category.name}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
                  <ProductCarousel 
                    title={category.name}
                    products={categoryProducts}
                  />
                </div>
              </div>
            );
          })}
        </section>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-24">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-lg mx-auto shadow-lg border border-white/30">
              <div className="text-7xl mb-6">🍽️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Cardápio em construção
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Em breve teremos deliciosos pratos para você!
              </p>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-sm text-blue-700">
                  💡 <strong>Para administradores:</strong> Acesse{' '}
                  <a 
                    href="/admin" 
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    /admin
                  </a>{' '}
                  para gerenciar o cardápio
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/30 backdrop-blur-sm border-t border-white/20 mt-20">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              🍴 {settings.businessName || 'Restaurante'}
            </h3>
            <p className="text-gray-600 mb-4">
              Cardápio digital desenvolvido para oferecer a melhor experiência
            </p>
            <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
              <span>Feito com</span>
              <span className="text-red-500">❤️</span>
              <span>e muito carinho</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      <CartButton />
      <Cart />
      
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <WhatsAppButton 
          phoneNumber={settings.whatsappNumber}
          message="Olá! Vi o cardápio e gostaria de fazer um pedido."
        />
      </div>
    </div>
  );
}
