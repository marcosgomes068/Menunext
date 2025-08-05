# 🍽️ Menu Digital - Sistema de Cardápio para Restaurantes ✅ FINALIZADO

> **Cardápio digital moderno e responsivo com sistema de pedidos via WhatsApp**

Um sistema completo de cardápio digital desenvolvido com Next.js 15, TypeScript e Tailwind CSS. Ideal para restaurantes, lanchonetes e estabelecimentos que desejam modernizar seu atendimento e facilitar pedidos via WhatsApp.

## ✨ Características Principais

### 🛍️ Para Clientes
- **Cardápio Digital Responsivo**: Navegação intuitiva em todos os dispositivos
- **Carrinho de Compras Inteligente**: Sistema robusto com personalização de produtos
- **Pedidos via WhatsApp**: Geração automática de mensagens formatadas
- **Status do Restaurante**: Visualização em tempo real se está aberto/fechado
- **Promoções em Destaque**: Carrossel automático de ofertas especiais

### ⚙️ Para Administradores
- **Painel Administrativo Completo**: Interface intuitiva para gestão total
- **CRUD Completo**: Produtos, categorias, promoções e configurações
- **Upload de Imagens**: Sistema otimizado com redimensionamento automático
- **Gerenciamento de Status**: Controle de horário de funcionamento
- **Personalização**: Logo, nome do negócio, número do WhatsApp

## 🚀 Tecnologias

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utilitário
- **[React Context API](https://react.dev/reference/react/useContext)** - Gerenciamento de estado
- **Local Storage** - Persistência de dados no navegador
- **React Image Crop** - Redimensionamento de imagens

## 📋 Pré-requisitos

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm, yarn, pnpm ou bun** - Gerenciador de pacotes

## 🛠️ Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/menu-digital.git
cd menu-digital
```

### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Execute o Ambiente de Desenvolvimento
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

### 4. Acesse a Aplicação
- **Cardápio**: [http://localhost:3000](http://localhost:3000)
- **Painel Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── admin/             # Painel administrativo
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial (cardápio)
├── components/            # Componentes React
│   ├── Cart.tsx           # Carrinho de compras
│   ├── CartButton.tsx     # Botão do carrinho
│   ├── ImageUploader.tsx  # Upload de imagens
│   ├── Navbar.tsx         # Barra de navegação
│   ├── ProductCarousel.tsx # Carrossel de produtos
│   ├── ProductModal.tsx   # Modal de produto
│   ├── PromotionCarousel.tsx # Carrossel de promoções
│   ├── RestaurantStatus.tsx # Status do restaurante
│   └── WhatsAppButton.tsx # Botão do WhatsApp
└── contexts/              # Contextos React
    ├── CartContext.tsx    # Estado do carrinho
    └── MenuContext.tsx    # Estado do cardápio
```

## 🎯 Funcionalidades Detalhadas

### 📱 Sistema de Carrinho
- **Adicionar/Remover Produtos**: Interface intuitiva
- **Personalização**: Opcionais e obrigatórios por produto
- **Observações**: Campo para comentários do cliente
- **Cálculo Automático**: Preço total com personalizações
- **WhatsApp Integration**: Mensagem formatada automaticamente

### 🛡️ Painel Administrativo
- **Gestão de Produtos**: Nome, descrição, preço, imagem, categoria
- **Gestão de Categorias**: Organização por seções
- **Gestão de Promoções**: Banners promocionais com controle de ativação
- **Configurações**: Nome do negócio, logo, WhatsApp, status de funcionamento

### 📸 Sistema de Imagens
- **Upload Otimizado**: Redimensionamento automático
- **Múltiplos Formatos**: Suporte para JPG, PNG, WebP
- **Aspect Ratio**: Proporções configuráveis por tipo de imagem
- **Compressão**: Otimização automática para web

## 🔧 Configuração para Produção

### 1. Build da Aplicação
```bash
npm run build
```

### 2. Iniciar em Produção
```bash
npm start
```

### 3. Deploy (Recomendações)

#### Vercel (Recomendado)
```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel
```

#### Docker
```bash
# Build da imagem
docker build -t menu-digital .

# Executar container
docker run -p 3000:3000 menu-digital
```

#### Netlify
```bash
# Build estático
npm run build
npm run export

# Upload da pasta out/ para Netlify
```

## 📚 Como Usar

### 👤 Para Clientes
1. **Navegar pelo cardápio** - Use as categorias ou barra de pesquisa
2. **Adicionar ao carrinho** - Clique no produto e personalize
3. **Revisar pedido** - Acesse o carrinho para conferir itens
4. **Fazer pedido** - Clique em "Pedir no WhatsApp"

### 👨‍💼 Para Administradores
1. **Acesse /admin** - Painel de administração
2. **Configure o negócio** - Aba "Configurações"
3. **Crie categorias** - Organize seu cardápio
4. **Adicione produtos** - Com fotos e personalizações
5. **Gerencie promoções** - Destaque ofertas especiais

## 🎨 Personalização

### Cores e Temas
Edite `src/app/globals.css` para personalizar:
```css
:root {
  --primary: #2563eb;
  --accent: #f59e0b;
  /* Outras variáveis CSS */
}
```

### Layout e Componentes
Todos os componentes são modulares e podem ser facilmente customizados.

## 🤝 Contribuição

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🏆 Créditos

Desenvolvido com ❤️ para facilitar a digitalização de restaurantes e melhorar a experiência dos clientes.

---

**Menu Digital** - Transformando a experiência gastronômica através da tecnologia.
