// eslint.config.js

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
const { ESLint } = require('eslint');

module.exports = [
  {
    files: ['src/**/*.{js,ts,tsx}'], // Incluye todos los archivos .js, .ts y .tsx en el directorio src
    ignores: ['node_modules/', 'dist/'], // Ignora los directorios node_modules y dist
    languageOptions: {
      parser: require('@typescript-eslint/parser'), // Asegúrate de requerir el parser correctamente
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // Tus reglas personalizadas
    },
  },
];
