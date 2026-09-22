export const formatPrice = price => {
	if (typeof price !== 'number') return ''

	return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const formatDate = date => {
	if (!(date instanceof Date)) return ''

	return date.toLocaleDateString('pt-BR')
}
