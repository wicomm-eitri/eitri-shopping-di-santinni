export default {
	// 🔧 Formatação geral
	arrowParens: 'avoid',
	bracketSameLine: true,
	bracketSpacing: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 120,
	tabWidth: 4,
	useTabs: true,
	semi: false,
	quoteProps: 'consistent',
	jsxSingleQuote: true,
	singleAttributePerLine: true,

	// 📦 Plugin de ordenação de imports
	plugins: ['@trivago/prettier-plugin-sort-imports'],

	// 📚 Ordem dos imports
	importOrder: [
		'^react$', // React (maior prioridade)
		'^eitri-(.*)$', // libs do Eitri (auto-import / base do projeto)
		'^wicomm-(.*)$', // libs internas Wicomm

		'<THIRD_PARTY_MODULES>', // libs externas estranhas

		'^../components/(.*)$', // componentes locais
		'^../providers/(.*)$', // providers
		'^../services/(.*)$', // services

		'^[./]' // imports relativos (fallback)
	],

	importOrderSeparation: false,
	importOrderSortSpecifiers: false
}
