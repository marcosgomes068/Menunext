'use client';

import React, { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { useMenu } from '@/contexts/MenuContext';
import type { Product, Category, Customization, Promotion } from '@/contexts/MenuContext';
import ImageUploader from '@/components/ImageUploader';

export default function AdminPage() {
  const {
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
  } = useMenu();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'promotions' | 'settings'>('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    categoryId: '',
    customizations: [] as Customization[],
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    displayOrder: 0,
  });

  const [promotionForm, setPromotionForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    isActive: true,
    displayOrder: 0,
  });

  const [settingsForm, setSettingsForm] = useState(settings);

  // Sincronizar settingsForm com as configurações do contexto
  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      categoryId: '',
      customizations: [],
    });
    setEditingProduct(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      displayOrder: 0,
    });
    setEditingCategory(null);
  };

  const resetPromotionForm = () => {
    setPromotionForm({
      title: '',
      description: '',
      imageUrl: '',
      isActive: true,
      displayOrder: 0,
    });
    setEditingPromotion(null);
  };

  const handleSaveProduct = () => {
    // Validações
    if (!productForm.name.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }
    if (!productForm.categoryId) {
      alert('Categoria é obrigatória');
      return;
    }
    if (productForm.price <= 0) {
      alert('Preço deve ser maior que zero');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...productForm,
      };
      addProduct(newProduct);
    }
    resetProductForm();
    setShowProductForm(false);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryForm);
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...categoryForm,
      };
      addCategory(newCategory);
    }
    resetCategoryForm();
    setShowCategoryForm(false);
  };

  const handleSavePromotion = () => {
    // Validações
    if (!promotionForm.title.trim()) {
      alert('Título da promoção é obrigatório');
      return;
    }
    if (!promotionForm.description.trim()) {
      alert('Descrição da promoção é obrigatória');
      return;
    }

    if (editingPromotion) {
      updatePromotion(editingPromotion.id, promotionForm);
    } else {
      const newPromotion = {
        id: Date.now().toString(),
        ...promotionForm,
      };
      addPromotion(newPromotion);
    }
    resetPromotionForm();
    setShowPromotionForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
      customizations: product.customizations || [],
    });
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      displayOrder: category.displayOrder,
    });
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setPromotionForm({
      title: promotion.title,
      description: promotion.description || '',
      imageUrl: promotion.imageUrl || '',
      isActive: promotion.isActive,
      displayOrder: promotion.displayOrder,
    });
    setEditingPromotion(promotion);
    setShowPromotionForm(true);
  };

  const handleSaveSettings = () => {
    try {
      updateSettings(settingsForm);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    }
  };

  const addCustomization = () => {
    const newCustomization: Customization = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      type: 'optional',
    };
    setProductForm({
      ...productForm,
      customizations: [...productForm.customizations, newCustomization],
    });
  };

  const updateCustomization = (index: number, field: keyof Customization, value: string | number) => {
    const updatedCustomizations = [...productForm.customizations];
    updatedCustomizations[index] = { ...updatedCustomizations[index], [field]: value };
    setProductForm({ ...productForm, customizations: updatedCustomizations });
  };

  const removeCustomization = (index: number) => {
    setProductForm({
      ...productForm,
      customizations: productForm.customizations.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Administração do Cardápio</h1>
                <p className="text-blue-100">Gerencie produtos, categorias, promoções e configurações</p>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 bg-white/50">
            <nav className="flex space-x-1 px-8 overflow-x-auto">
              {[
                { id: 'products', name: 'Produtos', icon: '🍽️' },
                { id: 'categories', name: 'Categorias', icon: '📂' },
                { id: 'promotions', name: 'Promoções', icon: '🎯' },
                { id: 'settings', name: 'Configurações', icon: '⚙️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'products' | 'categories' | 'promotions' | 'settings')}
                  className={`py-4 px-6 border-b-3 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Produtos</h2>
                    <p className="text-gray-600">Gerencie o catálogo de produtos do seu restaurante</p>
                  </div>
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Adicionar Produto</span>
                  </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="card group hover:shadow-lg transition-all duration-300">
                      {/* Product Image */}
                      {product.imageUrl && (
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                          <NextImage
                            src={product.imageUrl}
                            alt={product.name}
                            width={400}
                            height={192}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-gray-800 text-lg line-clamp-2">{product.name}</h3>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar produto"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir este produto?')) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir produto"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        
                        {product.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        )}
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-2xl font-bold text-blue-600">R$ {product.price.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {categories.find(c => c.id === product.categoryId)?.name || 'Sem categoria'}
                          </span>
                          {product.customizations && product.customizations.length > 0 && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                              {product.customizations.length} personalização(ões)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum produto cadastrado</h3>
                    <p className="text-gray-500 mb-6">Comece adicionando seu primeiro produto ao cardápio</p>
                    <button
                      onClick={() => setShowProductForm(true)}
                      className="btn-primary"
                    >
                      Adicionar Primeiro Produto
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Categorias</h2>
                    <p className="text-gray-600">Organize seus produtos em categorias</p>
                  </div>
                  <button
                    onClick={() => setShowCategoryForm(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Adicionar Categoria</span>
                  </button>
                </div>

                {/* Categories List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="card group hover:shadow-lg transition-all duration-300">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">📂</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                                <p className="text-sm text-gray-500">Ordem: {category.displayOrder}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <span>🍽️</span>
                                <span>{getProductsByCategory(category.id).length} produtos</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar categoria"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir esta categoria?')) {
                                  deleteCategory(category.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir categoria"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📂</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma categoria cadastrada</h3>
                    <p className="text-gray-500 mb-6">Organize seu cardápio criando categorias</p>
                    <button
                      onClick={() => setShowCategoryForm(true)}
                      className="btn-primary"
                    >
                      Criar Primeira Categoria
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Promotions Tab */}
            {activeTab === 'promotions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Promoções</h2>
                    <p className="text-gray-600">Crie e gerencie promoções atrativas para seus clientes</p>
                  </div>
                  <button
                    onClick={() => setShowPromotionForm(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>+</span>
                    <span>Nova Promoção</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promotions.map((promotion) => (
                    <div key={promotion.id} className="card group hover:shadow-lg transition-all duration-300">
                      {promotion.imageUrl && (
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                          <NextImage
                            src={promotion.imageUrl}
                            alt={promotion.title}
                            width={400}
                            height={192}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                          <div className="absolute top-3 right-3">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              promotion.isActive 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {promotion.isActive ? '🟢 Ativa' : '🔴 Inativa'}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{promotion.title}</h3>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditPromotion(promotion)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar promoção"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir esta promoção?')) {
                                  deletePromotion(promotion.id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir promoção"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{promotion.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <span>📊</span>
                            <span>Ordem: {promotion.displayOrder}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {promotions.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma promoção cadastrada</h3>
                    <p className="text-gray-500 mb-6">Crie promoções atrativas para aumentar suas vendas</p>
                    <button
                      onClick={() => setShowPromotionForm(true)}
                      className="btn-primary"
                    >
                      Criar Primeira Promoção
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Configurações</h2>
                  <p className="text-gray-600">Configure as informações básicas do seu estabelecimento</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Informações Básicas */}
                  <div className="card">
                    <div className="p-6 space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                        <span>🏪</span>
                        <span>Informações Básicas</span>
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome do Negócio
                        </label>
                        <input
                          type="text"
                          value={settingsForm.businessName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                          className="form-input"
                          placeholder="Ex: Restaurante Sabor & Arte"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo do Negócio
                        </label>
                        <ImageUploader
                          onImageUpload={(imageData) => setSettingsForm({ ...settingsForm, logoUrl: imageData })}
                          currentImage={settingsForm.logoUrl}
                          maxSize={2}
                          aspectRatio={1}
                          maxWidth={400}
                          maxHeight={400}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número do WhatsApp
                        </label>
                        <input
                          type="text"
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          className="form-input"
                          placeholder="5511999999999"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Use o formato: código do país + DDD + número (sem espaços ou símbolos)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status do Restaurante */}
                  <div className="card">
                    <div className="p-6 space-y-6">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                        <span>🕒</span>
                        <span>Status do Restaurante</span>
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              checked={settingsForm.isOpen}
                              onChange={(e) => setSettingsForm({ ...settingsForm, isOpen: e.target.checked })}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Restaurante está aberto para pedidos
                            </span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mensagem quando aberto
                          </label>
                          <input
                            type="text"
                            value={settingsForm.openingMessage}
                            onChange={(e) => setSettingsForm({ ...settingsForm, openingMessage: e.target.value })}
                            className="form-input"
                            placeholder="🟢 Estamos Abertos!"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mensagem quando fechado
                          </label>
                          <input
                            type="text"
                            value={settingsForm.closedMessage}
                            onChange={(e) => setSettingsForm({ ...settingsForm, closedMessage: e.target.value })}
                            className="form-input"
                            placeholder="🔴 Estamos Fechados"
                          />
                        </div>

                        {/* Preview do Status */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                          <p className="text-sm text-gray-600 mb-2 font-medium">Preview:</p>
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full animate-pulse ${
                                settingsForm.isOpen ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                settingsForm.isOpen ? 'text-green-700' : 'text-red-700'
                              }`}
                            >
                              {settingsForm.isOpen ? settingsForm.openingMessage : settingsForm.closedMessage}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSaveSettings}
                    className="btn-primary px-8 py-3 text-base"
                  >
                    💾 Salvar Configurações
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingProduct ? '✏️ Editar Produto' : '➕ Adicionar Produto'}
              </h3>
              <button
                onClick={() => {
                  setShowProductForm(false);
                  resetProductForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="form-input"
                    placeholder="Ex: Pizza Margherita"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="form-input resize-none"
                  rows={3}
                  placeholder="Descreva o produto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="form-input"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
                <ImageUploader
                  onImageUpload={(imageData) => setProductForm({ ...productForm, imageUrl: imageData })}
                  currentImage={productForm.imageUrl}
                  maxSize={5}
                  aspectRatio={4/3}
                  maxWidth={800}
                  maxHeight={600}
                />
              </div>

              {/* Customizations */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Personalizações</label>
                  <button
                    type="button"
                    onClick={addCustomization}
                    className="btn-secondary text-sm"
                  >
                    + Adicionar
                  </button>
                </div>
                
                {productForm.customizations.map((customization, index) => (
                  <div key={index} className="card mb-4">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">Personalização {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeCustomization(index)}
                          className="text-red-500 text-sm hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Nome da personalização"
                          value={customization.name}
                          onChange={(e) => updateCustomization(index, 'name', e.target.value)}
                          className="form-input text-sm"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Preço adicional"
                          value={customization.price}
                          onChange={(e) => updateCustomization(index, 'price', parseFloat(e.target.value) || 0)}
                          className="form-input text-sm"
                        />
                        <select
                          value={customization.type}
                          onChange={(e) => updateCustomization(index, 'type', e.target.value as 'required' | 'optional')}
                          className="form-input text-sm"
                        >
                          <option value="optional">Opcional</option>
                          <option value="required">Obrigatório</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowProductForm(false);
                  resetProductForm();
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProduct}
                className="btn-primary"
              >
                {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingCategory ? '✏️ Editar Categoria' : '➕ Adicionar Categoria'}
              </h3>
              <button
                onClick={() => {
                  setShowCategoryForm(false);
                  resetCategoryForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Categoria</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="form-input"
                  placeholder="Ex: Pizzas, Hambúrgueres, Bebidas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordem de Exibição</label>
                <input
                  type="number"
                  value={categoryForm.displayOrder}
                  onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: parseInt(e.target.value) || 0 })}
                  className="form-input"
                  placeholder="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Números menores aparecem primeiro no cardápio
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowCategoryForm(false);
                  resetCategoryForm();
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCategory}
                className="btn-primary"
              >
                {editingCategory ? 'Salvar Alterações' : 'Adicionar Categoria'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Form Modal */}
      {showPromotionForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingPromotion ? '✏️ Editar Promoção' : '➕ Adicionar Promoção'}
              </h3>
              <button
                onClick={() => {
                  setShowPromotionForm(false);
                  resetPromotionForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título da Promoção</label>
                <input
                  type="text"
                  value={promotionForm.title}
                  onChange={(e) => setPromotionForm({ ...promotionForm, title: e.target.value })}
                  className="form-input"
                  placeholder="Ex: Combo Especial, Desconto Família..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={promotionForm.description}
                  onChange={(e) => setPromotionForm({ ...promotionForm, description: e.target.value })}
                  className="form-input resize-none"
                  rows={3}
                  placeholder="Descreva a promoção de forma atrativa..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem da Promoção</label>
                <ImageUploader
                  onImageUpload={(imageUrl) => setPromotionForm({ ...promotionForm, imageUrl })}
                  currentImage={promotionForm.imageUrl}
                  aspectRatio={16/9}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ordem de Exibição</label>
                  <input
                    type="number"
                    value={promotionForm.displayOrder}
                    onChange={(e) => setPromotionForm({ ...promotionForm, displayOrder: parseInt(e.target.value) || 0 })}
                    className="form-input"
                    placeholder="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Números menores aparecem primeiro
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={promotionForm.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setPromotionForm({ ...promotionForm, isActive: e.target.value === 'active' })}
                    className="form-input"
                  >
                    <option value="active">🟢 Ativa</option>
                    <option value="inactive">🔴 Inativa</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowPromotionForm(false);
                  resetPromotionForm();
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePromotion}
                className="btn-primary"
              >
                {editingPromotion ? 'Salvar Alterações' : 'Adicionar Promoção'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
