// .eslintrc.js

export const root = true;
export const parser = '@typescript-eslint/parser';
export const parserOptions = {
  ecmaVersion: 2020,
  sourceType: 'module',
};
export const env = {
  browser: true,
  node: true,
  es6: true,
};
export const eslintExtends = [
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
];
export const plugins = ['@typescript-eslint'];
export const rules = {
  // Tus reglas personalizadas
};
export const ignorePatterns = ['node_modules/', 'dist/'];
export const overrides = [
  {
    files: ['src/**/*.{js,ts,tsx}'], // Incluye todos los archivos .js, .ts y .tsx en el directorio src
    rules: {
      // Reglas específicas para estos archivos
    },
  },
];
