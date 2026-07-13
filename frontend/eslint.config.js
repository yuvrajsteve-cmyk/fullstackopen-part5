import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: pluginReact
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-console': 0,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 0
    },
    settings: {
      react: {
        // 🚨 ਬਾਰੀਕੀ: ਆਟੋ-ਡਿਟੈਕਟ ਹਟਾ ਕੇ ਸਿੱਧਾ ਵਰਜ਼ਨ ਨੰਬਰ ਲਿਖ ਦਿੱਤਾ, ਤਾਂ ਜੋ ਕ੍ਰੈਸ਼ ਰੁਕ ਸਕੇ
        version: '18.2'
      }
    }
  }
]
