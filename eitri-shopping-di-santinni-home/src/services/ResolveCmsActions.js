import Eitri from 'eitri-bifrost'
import { openProductById, openProductBySlug, resolveNavigation } from './NavigationService'

const handleSearchAction = value => {
	Eitri.navigation.navigate({
		path: 'Search',
		state: {
			searchTerm: value
		}
	})
}
const formatBrandSlug = val => {
	if (!val) return ''
	let slug = String(val)
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')

	if (slug === 'disantinni' || slug === 'di-santini' || slug === 'disantini') {
		return 'di-santinni'
	}

	return slug
}

const handleCollectionAction = action => {
	console.log('[DEBUG] Raw action received in handleCollectionAction:', action)
	const rawValue = String(action?.value || '').trim()
	const rawTitle = String(action?.title || '').trim()
	const isNumeric = /^\d+$/.test(rawValue)

	let facets = []
	if (isNumeric) {
		facets = [{ key: 'productClusterIds', value: rawValue }]
		if (rawTitle && rawTitle.toLowerCase() !== 'marcas') {
			const brandSlug = formatBrandSlug(rawTitle)
			facets.push({ key: 'brand', value: brandSlug })
		}
	} else {
		const targetName = rawTitle || rawValue
		const brandSlug = formatBrandSlug(targetName)
		facets = [{ key: 'brand', value: brandSlug }]
	}

	console.log('[DEBUG] Navigating handleCollectionAction with facets:', facets)

	Eitri.navigation.navigate({
		path: 'ProductCatalog',
		state: {
			params: {
				facets,
				sort: action?.sort || ''
			},
			title: rawTitle || rawValue,
			banner: action?.banner || ''
		}
	})
}
const handlePageAction = value => {
	Eitri.navigation.navigate({
		path: 'LandingPage',
		state: {
			landingPageName: value
		}
	})
}
const handleCategoryAction = action => {
	const _categories = action?.value?.split('/')
	const categories = _categories?.filter(c => !!c)

	const params = {
		facets: categories?.map((c, index) => {
			return {
				key: `category-${index + 1}`,
				value: c
			}
		}),
		sort: action?.sort || ''
	}

	Eitri.navigation.navigate({
		path: 'ProductCatalog',
		state: { params, title: action?.title, banner: action?.banner }
	})
}
const handleProductAction = value => {
	if (/^\d+$/.test(value)) {
		openProductById(value)
	} else {
		openProductBySlug(value)
	}
}
const openBrand = action => {
	const facets = [{ key: 'brand', value: action?.value }]

	Eitri.navigation.navigate({
		path: 'ProductCatalog',
		state: { params: { facets, sort: action?.sort }, title: action?.title || '' }
	})
}
const openLink = link => {
	Eitri.openBrowser({
		url: link,
		inApp: true
	})
}

export const processActions = sliderData => {
	const action = sliderData?.action

	switch (action?.type) {
		case 'search':
			handleSearchAction(action.value)
			break
		case 'collection':
			handleCollectionAction(action)
			break
		case 'page':
			handlePageAction(action.value)
			break
		case 'category':
			handleCategoryAction(action)
			break
		case 'product':
			handleProductAction(action.value)
			break
		case 'path':
			resolveNavigation(action.value)
			break
		case 'brand':
			openBrand(action)
			break
		case 'link':
			openLink(action.value)
			break
		default:
			console.log(`Unknown action type: ${action.type}`)
	}
}
