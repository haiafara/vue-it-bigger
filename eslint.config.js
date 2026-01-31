import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/', 'gh-pages/', 'coverage/']
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['src/**/*.{js,vue}', 'demo/**/*.{js,vue}'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Image: 'readonly'
      }
    },
    rules: {
      'vue/no-v-html': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/order-in-components': 'off'
    }
  },
  {
    files: ['specs/**/*.spec.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
        document: 'readonly',
        window: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        KeyboardEvent: 'readonly',
        global: 'readonly'
      }
    }
  }
]
