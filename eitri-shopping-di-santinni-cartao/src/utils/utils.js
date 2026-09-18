export const formatPrice = price => {
	if (typeof price !== 'number') return ''

	return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
