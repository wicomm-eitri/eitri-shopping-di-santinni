import js from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
	pluginReact.configs.flat.recommended,
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		plugins: { js, 'react': pluginReact, 'unused-imports': unusedImports },
		extends: ['js/recommended'],
		languageOptions: { globals: globals.browser },
		settings: {
			react: {
				version: '18.0'
			}
		},
		rules: {
			// remove imports não usados automaticamente
			'unused-imports/no-unused-imports': 'error',
			'no-unused-vars': 'off',

			'no-undef': 'off',

			// React moderno não cobra isso
			'react/react-in-jsx-scope': 'off',
			'react/jsx-no-undef': 'off',
			'react/prop-types': 'off',

			'no-restricted-imports': [
				'warn',
				{
					paths: [
						{
							name: 'eitri-luminus',
							message: 'Não é necessário importar — já é global.'
						}
					]
				}
			],

			'padding-line-between-statements': [
				'warn',
				// 🔹 Sempre antes de return
				{ blankLine: 'always', prev: '*', next: 'return' },

				// 🔹 Separar blocos de lógica (if, loops, etc)
				{ blankLine: 'always', prev: '*', next: ['if', 'for', 'while', 'switch', 'try'] },
				{ blankLine: 'always', prev: ['if', 'for', 'while', 'switch', 'try'], next: '*' },

				// 🔹 Separar variáveis do resto
				{ blankLine: 'always', prev: ['const', 'let'], next: '*' },

				// 🔹 Mas NÃO separar entre variáveis
				{ blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },

				// 🔹 Separar imports do resto
				{ blankLine: 'always', prev: 'import', next: '*' },

				// 🔹 Agrupar imports
				{ blankLine: 'any', prev: 'import', next: 'import' }
			]
		}
	}
])
