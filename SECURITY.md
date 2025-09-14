# Segurança

## Recursos de Segurança

- Chaves de API armazenadas localmente no navegador
- Validação de entrada em todos os campos
- Sanitização de HTML para prevenir XSS
- Headers de segurança configurados
- Rate limiting implementado
- Validação de formato de chaves de API

## Configuração

Configure as variáveis de ambiente copiando `env.example` para `.env.local`:

```bash
cp env.example .env.local
```

## Deploy

Para produção, configure os headers de segurança no seu servidor web:

```nginx
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```