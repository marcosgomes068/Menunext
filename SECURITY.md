# 🔒 Guia de Segurança e Produção

## Configurações de Segurança

### Headers de Segurança
O projeto já inclui headers de segurança essenciais no `next.config.ts`:

```javascript
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff  
- Referrer-Policy: origin-when-cross-origin
- X-XSS-Protection: 1; mode=block
```

### Variáveis de Ambiente
**⚠️ NUNCA commite arquivos .env com dados sensíveis!**

```bash
# Produção
NODE_ENV=production
NEXT_PUBLIC_BUSINESS_NAME="Seu Restaurante"
NEXT_PUBLIC_WHATSAPP_NUMBER="5511999999999"
```

### HTTPS
**Obrigatório em produção:**
- Configure SSL/TLS no seu provedor
- Use HTTPS em todas as URLs de produção
- Configure redirects HTTP → HTTPS

## Configurações de Performance

### Otimizações Incluídas
- ✅ Compressão Gzip/Brotli automática
- ✅ Otimização de imagens (WebP, AVIF)
- ✅ Bundle splitting automático
- ✅ Tree shaking de dependências
- ✅ Minificação CSS/JS

### Cache Strategy
```nginx
# Nginx exemplo
location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /api/ {
    expires 0;
    add_header Cache-Control "no-cache";
}
```

## Monitoramento

### Métricas Essenciais
- Response time < 200ms
- Error rate < 0.1%
- Uptime > 99.9%
- Core Web Vitals otimizados

### Logs Recomendados
```javascript
// Error tracking
console.error('Error details:', error);

// Performance tracking  
console.time('operation');
// ... code
console.timeEnd('operation');
```

## Backup e Recuperação

### Dados do LocalStorage
O sistema usa localStorage para persistência. Considere:
- Implementar sync com backend
- Export/import de configurações
- Backup automático periódico

### Deployment Rollback
```bash
# Vercel
vercel rollback

# Docker
docker run previous-image-tag

# Manual
git checkout previous-commit
npm run build && npm start
```

## Checklist Pré-Produção

### Funcionalidades
- [ ] Todas as páginas carregam corretamente
- [ ] Carrinho funciona em todos os browsers
- [ ] WhatsApp integration testada
- [ ] Upload de imagens funcional
- [ ] Responsividade em dispositivos móveis

### Performance
- [ ] Lighthouse Score > 90
- [ ] Imagens otimizadas
- [ ] Bundle size < 500KB
- [ ] Tempo de carregamento < 3s

### Segurança
- [ ] Headers de segurança configurados
- [ ] HTTPS ativo
- [ ] Inputs sanitizados
- [ ] Sem dados sensíveis no frontend

### SEO
- [ ] Meta tags configuradas
- [ ] Sitemap.xml gerado
- [ ] robots.txt configurado
- [ ] Structured data implementado

## Problemas Comuns

### 1. Imagens não carregam
```javascript
// next.config.js
images: {
  domains: ['seu-dominio.com'],
  unoptimized: true // se necessário
}
```

### 2. Erro de localStorage
```javascript
// Verificar se está no browser
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

### 3. Build falha
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

### 4. Performance lenta
```javascript
// Lazy loading
const Component = dynamic(() => import('./Component'));

// Memoization
const MemoizedComponent = React.memo(Component);
```

## Suporte e Manutenção

### Atualizações
- Atualize dependências mensalmente
- Monitore security advisories
- Teste em ambiente staging primeiro

### Logs de Erro
Configure error tracking:
- Sentry para erros JS
- LogRocket para session replay
- Google Analytics para métricas

### Contato
Para suporte técnico:
- GitHub Issues
- Email: suporte@seudominio.com
- Documentação: wiki do projeto
