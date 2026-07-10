import { useEffect, useState } from 'react'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomCheckbox } from 'eitri-shopping-di-santinni-shared'
import { getProductsFacetsService } from '../../../services/ProductService'
import CustomModal from '../../CustomModal/CustomModal'
import PriceRange from './PriceRange'

const CollapsableFilterSection = ({ title, children }) => {
	const [collapsed, setCollapsed] = useState(true)

	return (
		<View className='flex flex-col gap-4'>
			<View
				onClick={() => setCollapsed(!collapsed)}
				className='flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors'>
				<Text className='text-base font-medium'>{title}</Text>
				<svg
					viewBox='0 0 24 24'
					width='20'
					height='20'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}>
					<path
						d='M19 14l-7 7-7-7'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</View>
			{!collapsed && <View>{children}</View>}
		</View>
	)
}

export default function CatalogFilter(props) {
	const {
		currentFilters,
		onFilterChange,
		onFilterClear,
		minPriceRange,
		setMinPriceRange,
		maxPriceRange,
		setMaxPriceRange
	} = props

	const [showModal, setShowModal] = useState(false)
	const [tempFilters, setTempFilters] = useState(currentFilters)
	const [filterFacets, setFilterFacets] = useState([])
	const [facetsLoading, setFacetsLoading] = useState(false)

	const [currentPriceRange, setCurrentPriceRange] = useState('')
	const [initialMaxPriceRange, setInitialMaxPriceRange] = useState(null)
	const [initialMinPriceRange, setInitialMinPriceRange] = useState(null)

	const { t } = useTranslation()

	useEffect(() => {
		loadFacetsOptions(currentFilters)
		resolvePriceRangeCurrentFacet(currentFilters)
	}, [])

	const loadFacetsOptions = async selectedFacets => {
		try {
			setFacetsLoading(true)
			const result = await getProductsFacetsService(selectedFacets)

			// Validar se result tem a estrutura esperada
			if (!result || !result.facets || !Array.isArray(result.facets)) {
				setFacetsLoading(false)

				return
			}

			const priceFacet = result.facets.find(f => f.type === 'PRICERANGE')
			let filteredFacets = result.facets.filter(f => f.type !== 'PRICERANGE' && !f.hidden)

			const uniqueFacetsMap = new Map()

			filteredFacets.forEach(facet => {
				const name = facet.name?.trim().toLowerCase()

				if (!name) return

				if (name === 'cor') facet.name = 'Cor'

				if (name === 'marca' || name === 'brand') facet.name = 'Marca'

				if (facet.values && Array.isArray(facet.values)) {
					const uniqueValuesMap = new Map()

					facet.values.forEach(v => {
						const vName = v.name?.trim().toLowerCase()

						if (!vName) return

						if (!uniqueValuesMap.has(vName)) {
							uniqueValuesMap.set(vName, v)
						} else {
							const existing = uniqueValuesMap.get(vName)
							const isExistingUpper = existing.name === existing.name?.toUpperCase()
							const isNewUpper = v.name === v.name?.toUpperCase()

							if (isExistingUpper && !isNewUpper) {
								v.quantity = Math.max(v.quantity || 0, existing.quantity || 0)
								uniqueValuesMap.set(vName, v)
							} else if (
								(v.quantity || 0) > (existing.quantity || 0) &&
								!(isNewUpper && !isExistingUpper)
							) {
								uniqueValuesMap.set(vName, v)
							}
						}
					})
					facet.values = Array.from(uniqueValuesMap.values())
				}

				if (uniqueFacetsMap.has(name)) {
					const existingFacet = uniqueFacetsMap.get(name)

					if (name === 'marca' || name === 'brand') {
						if (existingFacet.key === 'brand' && facet.key !== 'brand') {
							uniqueFacetsMap.set(name, facet)
						} else if (existingFacet.key !== 'brand' && facet.key !== 'brand') {
							const mergedValuesMap = new Map()

							;[...existingFacet.values, ...facet.values].forEach(v => {
								const vName = v.name?.trim().toLowerCase()

								if (vName && !mergedValuesMap.has(vName)) mergedValuesMap.set(vName, v)
							})
							existingFacet.values = Array.from(mergedValuesMap.values())
						}
					} else {
						const mergedValuesMap = new Map()

						;[...existingFacet.values, ...facet.values].forEach(v => {
							const vName = v.name?.trim().toLowerCase()

							if (!mergedValuesMap.has(vName)) {
								mergedValuesMap.set(vName, v)
							} else {
								const existing = mergedValuesMap.get(vName)
								const isExistingUpper = existing.name === existing.name?.toUpperCase()
								const isNewUpper = v.name === v.name?.toUpperCase()

								if (isExistingUpper && !isNewUpper) {
									mergedValuesMap.set(vName, v)
								}
							}
						})
						existingFacet.values = Array.from(mergedValuesMap.values())
					}
				} else {
					uniqueFacetsMap.set(name, facet)
				}
			})

			filteredFacets = Array.from(uniqueFacetsMap.values())

			resolvePriceRangeReceivedFacet(priceFacet)

			setFilterFacets(filteredFacets || [])
			setFacetsLoading(false)
		} catch (e) {
			console.error('Erro ao buscar facets', e)
			setFacetsLoading(false)
		}
	}

	const resolvePriceRangeReceivedFacet = priceRangeFacet => {
		if (minPriceRange && maxPriceRange) {
			// Uma vez configurado, nao precisa atualizar
			return
		}

		// Verificar se priceRangeFacet existe e tem valores
		if (!priceRangeFacet || !priceRangeFacet.values || !Array.isArray(priceRangeFacet.values)) {
			return
		}

		let min = Infinity
		let max = 0

		priceRangeFacet.values.forEach(value => {
			if (value.range.from < min) {
				min = value.range.from
			}

			if (value.range.to > max) {
				max = value.range.to
			}
		})

		setMaxPriceRange(max)
		setMinPriceRange(min)
	}

	const resolvePriceRangeCurrentFacet = currentFilters => {
		const priceRangeFacet = currentFilters?.facets?.find(f => f.key === 'price')

		if (priceRangeFacet) {
			const [min, max] = priceRangeFacet.value.split(':')

			setInitialMinPriceRange(min)
			setInitialMaxPriceRange(max)
		}
	}

	const handleFilterToggle = (filterValue, e) => {
		e.stopPropagation()
		const existingIndex = tempFilters?.facets?.findIndex(
			f => f.key === filterValue.key && f.value === filterValue.value
		)
		let newFacets

		if (existingIndex !== -1 && existingIndex !== undefined) {
			newFacets = tempFilters.facets.filter(f => !(f.key === filterValue.key && f.value === filterValue.value))
		} else {
			newFacets = [...(tempFilters?.facets || []), { key: filterValue.key, value: filterValue.value }]
		}

		setTempFilters({
			...tempFilters,
			facets: newFacets
		})
		loadFacetsOptions({
			...tempFilters,
			facets: newFacets
		})
	}

	const onApplyFilters = () => {
		if (currentPriceRange) {
			const updatedFacets = [
				...(tempFilters?.facets || []).filter(f => f.key !== 'price'),
				{ key: 'price', value: currentPriceRange }
			]

			const updatedFilters = {
				...tempFilters,
				facets: updatedFacets
			}

			setTempFilters(updatedFilters)
			onFilterChange(updatedFilters)
		} else {
			onFilterChange(tempFilters)
		}

		setShowModal(false)
	}

	return (
		<>
			<View
				onClick={() => !facetsLoading && setShowModal(true)}
				className={`flex h-[45px] w-full items-center justify-center gap-2 rounded border border-gray-500 bg-transparent px-4 ${
					facetsLoading ? 'opacity-60 pointer-events-none' : ''
				}`}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='16'
					height='16'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'>
					<path d='M22 3H2l8 9.46V19l4 2v-8.54L22 3z' />
				</svg>
				<Text className='text-xs uppercase text-gray-500'>{t('categoryPageModal.title', 'Filtros')}</Text>
			</View>

			{showModal && (
				<CustomModal
					open={showModal}
					onClose={() => setShowModal(false)}>
					<View
						onClick={e => e.stopPropagation()}
						className='bg-white rounded-t w-full max-h-[70vh] overflow-y-auto pointer-events-auto p-4'>
						<View className='flex flex-row items-center justify-between border-b border-gray-300 pb-4'>
							<Text className=' font-bold text-red-700 uppercase'>{t('Filtros')}</Text>
						</View>

						<View className='flex flex-col gap-4 mt-4'>
							{filterFacets.map(facet => (
								<CollapsableFilterSection
									key={facet.key}
									title={facet.name}>
									<View className='flex flex-col gap-4 mt-2'>
										{facet.values.map((value, index) => (
											<View
												key={`${facet.key}-${index}`}
												onClick={e => handleFilterToggle(value, e)}
												className={``}>
												<CustomCheckbox
													checked={value.selected}
													label={`${value.name} (${value.quantity})`}
												/>
											</View>
										))}
									</View>
								</CollapsableFilterSection>
							))}
							<CollapsableFilterSection
								key='price'
								title='Faixa de preço'>
								<View className='mt-2'>
									<PriceRange
										initialMin={initialMinPriceRange || minPriceRange}
										initialMax={initialMaxPriceRange || maxPriceRange}
										rangeMin={minPriceRange}
										rangeMax={maxPriceRange}
										step={1}
										onChange={range => setCurrentPriceRange(range)}
									/>
								</View>
							</CollapsableFilterSection>
						</View>

						<View className='p-4 w-full bg-white border-t border-gray-200 fixed left-0 bottom-0'>
							<View className='flex flex-row gap-3 w-full'>
								<View className='flex-1'>
									<View
										onClick={onFilterClear}
										className='flex h-[48px] items-center justify-center rounded-full border-2 border-red-700 bg-white hover:bg-red-50 transition-colors px-4'>
										<Text className='text-red-700 font-bold text-xs uppercase'>
											{t('categoryPageModal.clear', 'Limpar')}
										</Text>
									</View>
								</View>
								<View className='flex-1'>
									<View
										onClick={onApplyFilters}
										className='flex h-[48px] items-center justify-center rounded-full bg-red-700 hover:bg-red-800 transition-colors px-4'>
										<Text className='text-white font-bold text-xs uppercase'>
											{t('categoryPageModal.button', 'Filtrar')}
										</Text>
									</View>
								</View>
							</View>
							<BottomInset />
						</View>

						<View className={'w-full h-[77px]'} />
						<BottomInset />
					</View>
				</CustomModal>
			)}
		</>
	)
}
