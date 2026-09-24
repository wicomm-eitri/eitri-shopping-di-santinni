export const formatPrice = price => {
	if (typeof price !== 'number') return ''

	return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const formatDate = date => {
	if (!(date instanceof Date)) return ''

	return date.toLocaleDateString('pt-BR')
}

export const maskDocument = document => {
	const digits = (document || '').replace(/\D/g, '')

	if (digits.length !== 11) return ''

	return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`
}

// TODO: confirmar o total de etapas do cadastro com o PO
export const REGISTER_TOTAL_STEPS = 8
