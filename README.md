# LLM Prompter

Interface para teste e configuração de prompts com modelos de linguagem grandes (LLMs).

## Características

- Editor visual para criar e editar prompts de sistema
- Suporte para Google Gemini, OpenAI e Open Router
- Teste de prompts em tempo real com streaming
- Configuração de parâmetros do modelo
- Interface responsiva com tema escuro

## Instalação

1. Clone o repositório
   ```bash
   git clone https://github.com/jg0dz/prompter.git
   cd llm-prompter
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Execute o projeto
   ```bash
   npm run dev
   ```

4. Acesse no navegador
   ```
   http://localhost:5173
   ```

## Scripts

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Visualizar build

## Configuração

Configure suas chaves de API diretamente na interface:
- [Google Gemini](https://makersuite.google.com/app/apikey)
- [OpenAI](https://platform.openai.com/api-keys)
- [Open Router](https://openrouter.ai/keys)

## Deploy

```bash
npm run build
# Copie o conteúdo de dist/ para seu servidor web
```

## Licença

MIT