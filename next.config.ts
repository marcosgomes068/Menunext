import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações de produção otimizadas
  compress: true,
  poweredByHeader: false,
  
  // Output standalone para Docker
  output: 'standalone',
  
  // Configurações de imagem
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  },

  // Configurações de bundle
  turbopack: {
    // Configurações do Turbopack estável
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },

  // Configurações de cache
  async rewrites() {
    return [];
  },

  // Output para Docker (se necessário)
  // output: 'standalone',
};

export default nextConfig;
