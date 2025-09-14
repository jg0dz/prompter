// Sistema de validação e sanitização para segurança

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: any;
}

// Configurações de validação
const VALIDATION_CONFIG = {
  MAX_PROMPT_LENGTH: parseInt(import.meta.env.VITE_MAX_PROMPT_LENGTH || '10000'),
  MAX_BLOCKS: parseInt(import.meta.env.VITE_MAX_BLOCKS || '20'),
  MAX_TITLE_LENGTH: 100,
  MIN_PROMPT_LENGTH: 1,
  ALLOWED_HTML_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
  DANGEROUS_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  ]
};

/**
 * Valida e sanitiza texto de entrada
 */
export function validateAndSanitizeText(
  text: string, 
  fieldName: string = 'texto',
  maxLength: number = VALIDATION_CONFIG.MAX_PROMPT_LENGTH
): ValidationResult {
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      error: `${fieldName} é obrigatório`
    };
  }

  // Verificar comprimento mínimo
  if (text.trim().length < VALIDATION_CONFIG.MIN_PROMPT_LENGTH) {
    return {
      isValid: false,
      error: `${fieldName} deve ter pelo menos ${VALIDATION_CONFIG.MIN_PROMPT_LENGTH} caractere(s)`
    };
  }

  // Verificar comprimento máximo
  if (text.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} deve ter no máximo ${maxLength} caracteres`
    };
  }

  // Verificar padrões perigosos
  for (const pattern of VALIDATION_CONFIG.DANGEROUS_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        error: `${fieldName} contém conteúdo potencialmente perigoso`
      };
    }
  }

  // Sanitizar HTML básico (manter apenas tags seguras)
  const sanitized = sanitizeHtml(text);

  return {
    isValid: true,
    sanitizedValue: sanitized
  };
}

/**
 * Sanitiza HTML removendo tags perigosas
 */
function sanitizeHtml(html: string): string {
  // Remover todas as tags HTML exceto as permitidas
  const allowedTags = VALIDATION_CONFIG.ALLOWED_HTML_TAGS.join('|');
  const tagRegex = new RegExp(`<(?!\/?(?:${allowedTags})(?:\s|>))[^>]*>`, 'gi');
  
  return html
    .replace(tagRegex, '') // Remove tags não permitidas
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .trim();
}

/**
 * Valida chave de API
 */
export function validateApiKey(apiKey: string, provider: string): ValidationResult {
  if (!apiKey || typeof apiKey !== 'string') {
    return {
      isValid: false,
      error: 'Chave de API é obrigatória'
    };
  }

  const trimmedKey = apiKey.trim();
  
  if (trimmedKey.length < 10) {
    return {
      isValid: false,
      error: 'Chave de API parece muito curta'
    };
  }

  if (trimmedKey.length > 200) {
    return {
      isValid: false,
      error: 'Chave de API parece muito longa'
    };
  }

  // Verificar se contém apenas caracteres válidos para chaves de API
  const validKeyPattern = /^[A-Za-z0-9\-_\.]+$/;
  if (!validKeyPattern.test(trimmedKey)) {
    return {
      isValid: false,
      error: 'Chave de API contém caracteres inválidos'
    };
  }

  return {
    isValid: true,
    sanitizedValue: trimmedKey
  };
}

/**
 * Valida configuração do modelo
 */
export function validateModelConfig(config: any): ValidationResult {
  if (!config || typeof config !== 'object') {
    return {
      isValid: false,
      error: 'Configuração do modelo é obrigatória'
    };
  }

  // Validar provider
  const validProviders = ['Google Gemini', 'OpenAI', 'Open Router'];
  if (!validProviders.includes(config.provider)) {
    return {
      isValid: false,
      error: 'Provedor de modelo inválido'
    };
  }

  // Validar temperatura
  if (typeof config.temperature !== 'number' || 
      config.temperature < 0 || 
      config.temperature > 2) {
    return {
      isValid: false,
      error: 'Temperatura deve ser um número entre 0 e 2'
    };
  }

  // Validar topP
  if (typeof config.topP !== 'number' || 
      config.topP < 0 || 
      config.topP > 1) {
    return {
      isValid: false,
      error: 'Top-p deve ser um número entre 0 e 1'
    };
  }

  // Validar modelo
  if (!config.model || typeof config.model !== 'string' || config.model.trim().length === 0) {
    return {
      isValid: false,
      error: 'Modelo é obrigatório'
    };
  }

  return {
    isValid: true,
    sanitizedValue: config
  };
}

/**
 * Valida array de blocos de prompt
 */
export function validatePromptBlocks(blocks: any[]): ValidationResult {
  if (!Array.isArray(blocks)) {
    return {
      isValid: false,
      error: 'Blocos de prompt devem ser um array'
    };
  }

  if (blocks.length > VALIDATION_CONFIG.MAX_BLOCKS) {
    return {
      isValid: false,
      error: `Máximo de ${VALIDATION_CONFIG.MAX_BLOCKS} blocos permitidos`
    };
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    
    if (!block || typeof block !== 'object') {
      return {
        isValid: false,
        error: `Bloco ${i + 1} é inválido`
      };
    }

    // Validar ID
    if (!block.id || typeof block.id !== 'string') {
      return {
        isValid: false,
        error: `Bloco ${i + 1} deve ter um ID válido`
      };
    }

    // Validar título
    const titleValidation = validateAndSanitizeText(
      block.title, 
      `Título do bloco ${i + 1}`,
      VALIDATION_CONFIG.MAX_TITLE_LENGTH
    );
    if (!titleValidation.isValid) {
      return {
        isValid: false,
        error: titleValidation.error
      };
    }

    // Validar conteúdo
    const contentValidation = validateAndSanitizeText(
      block.content, 
      `Conteúdo do bloco ${i + 1}`
    );
    if (!contentValidation.isValid) {
      return {
        isValid: false,
        error: contentValidation.error
      };
    }
  }

  return {
    isValid: true,
    sanitizedValue: blocks
  };
}

/**
 * Rate limiting simples baseado em localStorage
 */
export function checkRateLimit(): ValidationResult {
  const now = Date.now();
  const windowMs = parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '60000');
  const maxRequests = parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS || '100');
  
  try {
    const stored = localStorage.getItem('rateLimit');
    let rateLimitData = stored ? JSON.parse(stored) : { requests: [], windowStart: now };
    
    // Limpar requisições antigas
    rateLimitData.requests = rateLimitData.requests.filter(
      (timestamp: number) => now - timestamp < windowMs
    );
    
    // Verificar limite
    if (rateLimitData.requests.length >= maxRequests) {
      return {
        isValid: false,
        error: `Muitas requisições. Tente novamente em ${Math.ceil(windowMs / 60000)} minutos.`
      };
    }
    
    // Adicionar nova requisição
    rateLimitData.requests.push(now);
    localStorage.setItem('rateLimit', JSON.stringify(rateLimitData));
    
    return {
      isValid: true
    };
  } catch (error) {
    console.warn('Erro ao verificar rate limit:', error);
    return {
      isValid: true // Em caso de erro, permitir a requisição
    };
  }
}
