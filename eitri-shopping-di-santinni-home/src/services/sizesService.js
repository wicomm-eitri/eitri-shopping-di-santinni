import { getProductsFacetsService } from './ProductService'

const SIZE_DEPARTMENTS = ['feminino', 'masculino', 'infantil', 'tenis']

const categorySizesCache = new Map()

export const formatSizeLabel = (value, name) => {
	if (/^\d+([.,]\d+)?$/.test(value)) return value

	if (/^\d+-\d+$/.test(value)) return value

	return (name || value).toUpperCase()
}

export const isFootwearSize = value => {
	const isNumeric = /^\d+([.,]\d+)?$/.test(value)
	const isRange = /^\d+-\d+$/.test(value)

	if (!isNumeric && !isRange) return false

	const parts = value.split('-')

	return parts.every(part => {
		const num = parseFloat(part.replace(',', '.'))

		return !isNaN(num) && num >= 10 && num <= 48
	})
}

export const sortSizes = sizeList => {
	return [...sizeList].sort((a, b) => {
		const getGroup = title => {
			const isQuebrado = title.includes('-') || title.includes('/') || title.includes(',') || title.includes('.')

			const numMatch = title.match(/\d+/)
			const num = numMatch ? parseInt(numMatch[0], 10) : NaN

			if (!isNaN(num)) {
				const isAdult = num >= 33

				if (isAdult) {
					return isQuebrado ? 2 : 1
				} else {
					return isQuebrado ? 4 : 3
				}
			}

			return 5
		}

		const groupA = getGroup(a.title)
		const groupB = getGroup(b.title)

		if (groupA !== groupB) {
			return groupA - groupB
		}

		const numA = parseFloat(a.title)
		const numB = parseFloat(b.title)

		if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
			return numA - numB
		}

		return a.title.localeCompare(b.title)
	})
}

export const fetchDepartmentSizes = async deptName => {
	if (!deptName) return []

	const dept = deptName.toLowerCase().trim()

	try {
		const res = await getProductsFacetsService({ facets: [{ key: 'category-1', value: dept }] })
		const facet = res?.facets?.find(f => f.key === 'tamanho' || f.name?.toLowerCase() === 'tamanho')

		if (!facet || !facet.values) return []

		const byValue = new Map()

		for (const v of facet.values) {
			const valStr = String(v.value)

			if (isFootwearSize(valStr) && !byValue.has(valStr)) {
				byValue.set(valStr, formatSizeLabel(valStr, String(v.name ?? v.value)))
			}
		}

		const items = Array.from(byValue.entries()).map(([value, text]) => ({
			title: text,
			action: {
				type: 'path',
				value: `/${encodeURIComponent(dept)}/${encodeURIComponent(value)}?map=c,tamanho`
			}
		}))

		return sortSizes(items)
	} catch (e) {
		console.error(`Error fetching sizes for department ${deptName}:`, e)

		return []
	}
}

export const fetchAllStoreSizes = async () => {
	if (categorySizesCache.has('__ALL__')) {
		return categorySizesCache.get('__ALL__')
	}

	const results = await Promise.all(
		SIZE_DEPARTMENTS.map(async dept => {
			try {
				const res = await getProductsFacetsService({ facets: [{ key: 'category-1', value: dept }] })
				const facet = res?.facets?.find(f => f.key === 'tamanho' || f.name?.toLowerCase() === 'tamanho')

				return facet?.values || []
			} catch (e) {
				return []
			}
		})
	)

	const byValue = new Map()

	for (const list of results) {
		for (const v of list) {
			const valStr = String(v.value)

			if (isFootwearSize(valStr) && !byValue.has(valStr)) {
				byValue.set(valStr, formatSizeLabel(valStr, String(v.name ?? v.value)))
			}
		}
	}

	const items = Array.from(byValue.entries()).map(([value, text]) => ({
		title: text,
		action: {
			type: 'path',
			value: `/${encodeURIComponent(value)}?map=tamanho`
		}
	}))

	const sorted = sortSizes(items)

	categorySizesCache.set('__ALL__', sorted)

	return sorted
}

export const fetchCategorySizes = async categoryTitle => {
	if (!categoryTitle) return await fetchAllStoreSizes()

	const key = categoryTitle.toLowerCase().trim()

	if (categorySizesCache.has(key)) {
		return categorySizesCache.get(key)
	}

	let sizes = await fetchDepartmentSizes(key)

	if (!sizes || sizes.length === 0) {
		sizes = await fetchAllStoreSizes()
	}

	categorySizesCache.set(key, sizes)

	return sizes
}
