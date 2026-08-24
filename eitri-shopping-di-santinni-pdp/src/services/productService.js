import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'

export const getProductById = async productId => {
	return Vtex.searchGraphql.product({
		identifier: { field: 'id', value: productId }
	})
}

export const getProductBySlug = async slug => {
	return Vtex.searchGraphql.product({
		identifier: { field: 'slug', value: slug }
	})
}

export const getWhoSawAlsoSaw = async productId => {
	return Vtex.catalog.getWhoSawAlsoSaw(productId)
}

export const getProductsRecommendations = async productId => {
	return Vtex.searchGraphql.productRecommendations({
		identifier: { field: 'id', value: productId },
		type: 'view'
	})
}

export const getSimilarProducts = async productId => {
	return Vtex.catalog.getSimilarProducts(productId)
}

const getSpecificationValue = (product, specName) => {
	const fromProperties = product?.properties?.find(p => p.name === specName)

	if (fromProperties) return fromProperties.values?.[0]

	// Quando o produto vem através do intelligenceSearch a forma de pegar as especificações é diferente
	const group = product?.specificationGroups?.find(g => g.originalName === 'allSpecifications')
	const spec = group?.specifications?.find(s => s.name === specName)

	return spec?.values?.[0]
}

// Produtos de outras cores do mesmo modelo, agrupados pela especificação "Agrupador"
// Usa o mesmo endpoint do Intelligent Search que o resolver agrupadorProducts do site (FastStore)
export const getGroupedVariants = async product => {
	const agrupadorValue = getSpecificationValue(product, 'Agrupador')

	if (!agrupadorValue) return []

	const result = await Vtex.catalog.getProductsByFacets(`Agrupador/${encodeURIComponent(agrupadorValue)}`)

	return (result?.products || []).map(p => {
		const firstImage = p.items?.[0]?.images?.[0]
		const corProp = (p.properties || []).find(prop => prop.name === 'COR' || prop.originalName === 'COR')

		return {
			productId: p.productId,
			productName: p.productName,
			linkText: p.linkText,
			imageUrl: firstImage?.imageUrl,
			imageAlt: firstImage?.imageText || p.productName,
			cor: corProp?.values?.[0] ?? null,
			isAvailable:
				p.items?.some(item => item.sellers?.some(s => s.commertialOffer?.AvailableQuantity > 0)) ?? false
		}
	})
}

export const markLastViewedProduct = async product => {
	const key = `last-seen-products`

	const productHistory = await Eitri.sharedStorage.getItemJson(key)

	if (productHistory) {
		const prevContentIndex = productHistory.findIndex(content => content.productId === product.productId)

		if (prevContentIndex === 0) return

		if (prevContentIndex !== -1) {
			productHistory.splice(prevContentIndex, 1)
			productHistory.unshift({ productId: product.productId, date: new Date().toISOString() })
		} else {
			productHistory.unshift({ productId: product.productId, date: new Date().toISOString() })
		}

		await Eitri.sharedStorage.setItemJson(key, productHistory.slice(0, 14))
	} else {
		await Eitri.sharedStorage.setItemJson(key, [{ productId: product.productId, date: new Date().toISOString() }])
	}
}
