import React, { useRef, useState } from 'react';
import NextImage from 'next/image';
import { Product } from '@/contexts/MenuContext';
import ProductModal from './ProductModal';

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 border border-gray-200 shadow-none"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 border border-gray-200 shadow-none"
            aria-label="Próximo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 pb-2 px-2 custom-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[220px] max-w-xs bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center scroll-snap-align transition-shadow hover:shadow-md"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="w-full h-32 mb-3 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
              {product.imageUrl ? (
                <NextImage 
                  src={product.imageUrl} 
                  alt={product.name} 
                  width={220}
                  height={128}
                  className="object-cover w-full h-full rounded-lg"
                  onError={(e) => {
                    // Em caso de erro na imagem, mostra o emoji
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div className={`image-fallback w-full h-full flex items-center justify-center ${product.imageUrl ? 'hidden' : ''}`}>
                <span className="text-gray-400 text-4xl">🍔</span>
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1 text-center">{product.name}</h3>
            {product.description && (
              <p className="text-xs text-gray-600 mb-2 text-center line-clamp-2">
                {product.description}
              </p>
            )}
            <span className="text-blue-600 font-bold text-sm mb-2">R$ {product.price.toFixed(2)}</span>
            <button 
              onClick={() => handleProductClick(product)}
              className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition text-sm font-medium"
            >
              Adicionar
            </button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }
      `}</style>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default ProductCarousel;
