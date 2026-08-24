/**
 * Normaliza os facets retornados pela VTEX para evitar duplicidades de "Cor" e "Marca",
 * garantindo que "Marca" seja extraída prioritariamente do campo de ATRIBUTO/ESPECIFICAÇÃO
 * (excluindo a marca nativa genérica da VTEX quando houver especificação).
 */
export const normalizeFacets = rawFacets => {
	if (!Array.isArray(rawFacets) || rawFacets.length === 0) return []

	const availableFacets = rawFacets.filter(f => f && f.type !== 'PRICERANGE' && !f.hidden)

	// Verificar se existe algum facet de Marca vindo de ATRIBUTO/ESPECIFICAÇÃO
	const hasSpecificationBrand = availableFacets.some(
		f =>
			f.key !== 'brand' &&
			f.key !== 'b' &&
			f.type !== 'BRAND' &&
			((f.name || '').trim().toLowerCase().includes('marca') ||
				(f.name || '').trim().toLowerCase().includes('brand') ||
				(f.key || '').trim().toLowerCase().includes('marca'))
	)

	// Se existir especificação de Marca, removemos a marca nativa genérica da VTEX (key === 'brand' ou 'b' ou type === 'BRAND')
	const filteredFacets = availableFacets.filter(f => {
		if (hasSpecificationBrand) {
			const isNativeBrand = f.key === 'brand' || f.key === 'b' || f.type === 'BRAND'

			if (isNativeBrand) return false
		}

		return true
	})

	const facetsMap = new Map()

	filteredFacets.forEach(facet => {
		const rawName = (facet.name || '').trim().toLowerCase()
		const facetKey = (facet.key || '').trim().toLowerCase()

		if (!rawName && !facetKey) return

		const isBrand =
			rawName.includes('marca') ||
			rawName.includes('brand') ||
			facetKey === 'brand' ||
			facetKey === 'b' ||
			facetKey.includes('marca')

		const isCor =
			rawName.includes('cor') ||
			rawName.includes('color') ||
			facetKey.includes('cor') ||
			facetKey.includes('color')

		let groupKey = rawName || facetKey
		let displayName = facet.name || facetKey

		if (isBrand) {
			groupKey = 'marca'
			displayName = 'Marca'
		} else if (isCor) {
			groupKey = 'cor'
			displayName = 'Cor'
		}

		// Deduplicar e limpar os valores do facet (values)
		const cleanValues = []

		if (Array.isArray(facet.values)) {
			const valueMap = new Map()

			facet.values.forEach(val => {
				const valName = (val.name || val.value || '').trim()

				if (!valName) return

				const lowerValName = valName.toLowerCase()

				if (!valueMap.has(lowerValName)) {
					valueMap.set(lowerValName, {
						...val,
						name: valName,
						quantity: val.quantity || 0,
						key: val.key || facet.key
					})
				} else {
					const existing = valueMap.get(lowerValName)
					const isExistingAllCaps = existing.name === existing.name.toUpperCase()
					const isNewAllCaps = valName === valName.toUpperCase()

					if (isExistingAllCaps && !isNewAllCaps) {
						valueMap.set(lowerValName, {
							...val,
							name: valName,
							quantity: Math.max(existing.quantity || 0, val.quantity || 0),
							key: val.key || facet.key
						})
					} else {
						existing.quantity = Math.max(existing.quantity || 0, val.quantity || 0)

						if (val.selected) existing.selected = true
					}
				}
			})

			cleanValues.push(...Array.from(valueMap.values()))
		}

		if (cleanValues.length === 0) return

		const formattedFacet = {
			...facet,
			name: displayName,
			values: cleanValues
		}

		if (!facetsMap.has(groupKey)) {
			facetsMap.set(groupKey, formattedFacet)
		} else {
			const existingGroup = facetsMap.get(groupKey)
			const mergedValueMap = new Map()

			;[...existingGroup.values, ...formattedFacet.values].forEach(v => {
				const lName = (v.name || '').toLowerCase()

				if (lName && !mergedValueMap.has(lName)) {
					mergedValueMap.set(lName, v)
				} else if (lName) {
					const existingV = mergedValueMap.get(lName)

					existingV.quantity = Math.max(existingV.quantity || 0, v.quantity || 0)

					if (v.selected) existingV.selected = true
				}
			})

			existingGroup.values = Array.from(mergedValueMap.values())
		}
	})

	const resultFacets = Array.from(facetsMap.values())

	resultFacets.forEach(facet => {
		if (facet.name === 'Marca' && Array.isArray(facet.values)) {
			facet.values.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR', { sensitivity: 'base' }))
		}
	})

	return resultFacets
}
