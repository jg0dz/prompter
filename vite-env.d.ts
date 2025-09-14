/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAX_PROMPT_LENGTH?: string;
  readonly VITE_MAX_BLOCKS?: string;
  readonly VITE_RATE_LIMIT_WINDOW?: string;
  readonly VITE_RATE_LIMIT_REQUESTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
