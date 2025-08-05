import { useState } from 'react';
import Image from 'next/image';
import WhatsAppButton from './WhatsAppButton';

// Ícones personalizados
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface Category {
  id: string;
  name: string;
  displayOrder: number;
}

interface NavbarProps {
  logoUrl?: string;
  businessName?: string;
  whatsappNumber?: string;
  categories?: Category[];
}

const Navbar = ({ 
  logoUrl = '/logo.svg', 
  businessName = 'Menu Digital',
  whatsappNumber = '5511999999999',
  categories = []
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Ordenar categorias por displayOrder
  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  // Função para scroll suave até a categoria
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const navbarHeight = 64; // altura da navbar
      const elementPosition = element.offsetTop - navbarHeight - 20;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Menu Button (Mobile) */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Abrir menu"
              >
                {isMenuOpen ? (
                  <CloseIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Logo (Center) */}
            <div className="flex-1 flex justify-center lg:justify-center">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src={logoUrl}
                    alt={`Logo ${businessName}`}
                    fill
                    className="object-contain rounded-lg"
                    onError={(e) => {
                      // Fallback para quando não há logo personalizada
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback logo */}
                  <div className="hidden w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">
                  {businessName}
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {sortedCategories.length > 0 ? (
                sortedCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {category.name}
                  </button>
                ))
              ) : (
                <span className="text-gray-500 text-sm">Nenhuma categoria disponível</span>
              )}
            </div>

            {/* WhatsApp Button */}
            <div className="flex items-center">
              <WhatsAppButton phoneNumber={whatsappNumber} />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay (Mobile) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar Menu (Mobile) */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8">
                <Image
                  src={logoUrl}
                  alt={`Logo ${businessName}`}
                  fill
                  className="object-contain rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {businessName}
              </span>
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Sidebar Menu Items */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <nav className="space-y-2">
              {sortedCategories.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-4">
                    📋 Categorias do Cardápio
                  </div>
                  {sortedCategories.map((category, index) => (
                    <button
                      key={category.id}
                      onClick={() => scrollToCategory(category.id)}
                      className="w-full text-left block px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors group"
                    >
                      <span className="flex items-center justify-between">
                        <span className="flex items-center">
                          <span className="mr-3 text-lg group-hover:scale-110 transition-transform">
                            {index === 0 ? '🥗' : index === 1 ? '🍔' : index === 2 ? '🍕' : index === 3 ? '🍰' : '🍽️'}
                          </span>
                          <span className="font-medium">{category.name}</span>
                        </span>
                        <span className="text-xs text-gray-400 group-hover:text-blue-400">
                          →
                        </span>
                      </span>
                    </button>
                  ))}
                  
                  {/* Rodapé da sidebar */}
                  <div className="mt-8 pt-4 border-t border-gray-100">
                    <div className="px-4 py-2 text-xs text-gray-400 text-center">
                      🍴 Navegue pelas categorias acima para ver nossos pratos
                    </div>
                  </div>
                </>
              ) : (
                <div className="px-4 py-8 text-center">
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="text-gray-500 text-sm font-medium">
                    Nenhuma categoria disponível ainda.
                  </p>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                    O cardápio será exibido aqui quando categorias forem adicionadas pelo administrador.
                  </p>
                </div>
              )}
            </nav>
          </div>

          {/* Sidebar Footer removido */}
        </div>
      </div>
    </>
  );
};

export default Navbar;
