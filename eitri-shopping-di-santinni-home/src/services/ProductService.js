import { App, Vtex } from 'eitri-shopping-vtex-shared'
import { resolveSortParam } from './helpers/resolveSortParam'

const colorVariantsCache = new Map()

export const autocompleteSuggestions = async value => {
	return await Vtex.catalog.autoCompleteSuggestions(value)
}

const fetchColorVariants = async product => {
	const reference = String(product?.productReference || '').trim()
	const prefix = reference.slice(0, -2)
	let variants = []

	if (/^\d{4,}$/.test(prefix)) {
		try {
			const result = await Vtex.searchGraphql.productSearch({
				fullText: prefix,
				from: 0,
				to: 49,
				hideUnavailableItems: true
			})

			variants = (result?.products || []).filter(p => {
				const candidateReference = String(p?.productReference || '').trim()

				return (
					candidateReference.length === reference.length &&
					candidateReference.startsWith(prefix) &&
					String(p?.productId) !== String(product?.productId)
				)
			})
		} catch (error) {
			console.error('Error fetching color variants by reference', error)
		}
	}

	if (variants.length === 0) {
		try {
			variants = (await Vtex.catalog.getSimilarProducts(product?.productId)) || []
		} catch (error) {
			console.error('Error fetching similar products', error)
		}
	}

	return Promise.all(
		variants.map(async variant => {
			if (variant?.items?.length) return variant

			try {
				const fullProduct = await Vtex.catalog.getProductById(variant?.productId)

				return Array.isArray(fullProduct) ? fullProduct[0] : fullProduct
			} catch (error) {
				console.error('Error hydrating color variant', error)

				return variant
			}
		})
	)
}

export const getColorVariants = product => {
	const reference = String(product?.productReference || '').trim()
	const referencePrefix = reference.slice(0, -2)
	const cacheKey = /^\d{4,}$/.test(referencePrefix) ? referencePrefix : String(product?.productId || '')

	if (!cacheKey) return Promise.resolve([])

	if (!colorVariantsCache.has(cacheKey)) {
		colorVariantsCache.set(
			cacheKey,
			fetchColorVariants(product).catch(error => {
				colorVariantsCache.delete(cacheKey)
				throw error
			})
		)
	}

	return colorVariantsCache.get(cacheKey)
}

export const getCollectionName = async collectionId => {
	try {
		const result = await Vtex.catalog.getProductsByFacets(`productClusterIds/${collectionId}`, { count: 1 })
		const clusters = result?.products?.[0]?.productClusters

		return clusters?.find(cluster => String(cluster.id) === String(collectionId))?.name || ''
	} catch (error) {
		console.error('Error fetching collection name', error)

		return ''
	}
}

/*
 * {
 *  facets: Array<{ key: string, value: string }>
 *  query: string
 *  sort: string
 * }
 *
 * */

export const getProductsService = async (params, page) => {
	const remoteConfig = App?.configs?.appConfigs

	const useRestSearch = remoteConfig?.useRestSearch

	if (useRestSearch) {
		return getProductsServiceRest(params, page)
	}

	const PAGE_SIZE = 12

	// Validar se params está presente e é um objeto válido
	if (!params || typeof params !== 'object') {
		return null
	}

	// Validar se facets é um array válido quando presente
	if (params.facets && !Array.isArray(params.facets)) {
		return null
	}

	let from = params?.from || 1
	let to = params?.to || PAGE_SIZE

	if (page) {
		from = (page - 1) * PAGE_SIZE + 1
		to = page * PAGE_SIZE
	}

	// Garantir que selectedFacets seja um array válido ou null
	const selectedFacets = Array.isArray(params?.facets) ? params.facets : null

	const options = {
		fullText: params?.query || params?.q || '',
		selectedFacets: selectedFacets,
		orderBy: resolveSortParam(params?.sort, true),
		from: from,
		to: to,
		hideUnavailableItems: true
	}

	// Remover propriedades undefined/null que podem causar problemas no GraphQL
	Object.keys(options).forEach(key => {
		if (options[key] === undefined || options[key] === null) {
			delete options[key]
		}
	})

	return await Vtex.searchGraphql.productSearch(options)
}

export const getProductsServiceRest = async (params, page) => {
	const facetsPath = params?.facets?.map(facet => `${facet.key}/${facet.value}`).join('/')
	const options = {
		query: params?.query || params?.q || '',
		page: page ?? 1,
		sort: resolveSortParam(params.sort)
	}

	if (params?.count) {
		options.count = params.count
	}

	return await Vtex.catalog.getProductsByFacets(facetsPath, options)
}

export const getProductsFacetsService = async params => {
	// Validar se params está presente e é um objeto válido
	if (!params || typeof params !== 'object') {
		throw new Error('Invalid parameters provided to getProductsFacetsService')
	}

	// Garantir que selectedFacets seja um array válido ou null
	const selectedFacets = Array.isArray(params?.facets) ? params.facets : null

	const options = {
		fullText: params?.query || params?.q || '',
		selectedFacets: selectedFacets,
		hideUnavailableItems: true
	}

	// Remover propriedades undefined que podem causar problemas no GraphQL
	Object.keys(options).forEach(key => {
		if (options[key] === undefined) {
			delete options[key]
		}
	})

	const result = await Vtex.searchGraphql.facets(options)

	// Validar e garantir estrutura do resultado
	if (!result || typeof result !== 'object') {
		return { facets: [] }
	}

	// Garantir que facets seja sempre um array
	if (!Array.isArray(result.facets)) {
		return { facets: [] }
	}

	return result
}

export const getProductsFacetsServiceRest = async params => {
	const facetsPath = params?.facets?.map(facet => `${facet.key}/${facet.value}`).join('/')
	const options = {
		query: params?.query || params?.q || ''
	}

	const result = await Vtex.catalog.getPossibleFacets(facetsPath, options)

	return formatPriceRangeFacet(result)
}

const formatPriceRangeFacet = facetQueryResult => {
	return facetQueryResult.facets.map(facet => {
		if (facet.type === 'PRICERANGE') {
			return {
				...facet,
				values: facet.values.map(value => {
					return {
						...value,
						name: `De ${value?.range?.from?.toLocaleString('pt-br', {
							style: 'currency',
							currency: 'BRL'
						})} à ${value.range.to.toLocaleString('pt-br', {
							style: 'currency',
							currency: 'BRL'
						})}`,
						value: `${value.range.from}:${value.range.to}`
					}
				})
			}
		} else {
			return facet
		}
	})
}

export const getProductById = async productId => {
	return await Vtex.searchGraphql.product({
		identifier: { field: 'id', value: productId }
	})
}
