import { RemoteConfig } from 'eitri-shopping-vtex-shared'
import { sortSku } from '../../utils/skuSort'

// Get unique values per attribute
function getUniqueValues(skus, key) {
	return [...new Set(skus.map(s => s.attributes[key]).filter(value => value != null))]
}

// Given current selections (excluding the key being evaluated),
// returns a map of value -> { exists, availableExists }
function getOptionStatus(skus, attributeKeys, key, selections) {
	const otherKeys = attributeKeys.filter(k => k !== key)
	const values = getUniqueValues(skus, key)

	return values.reduce((acc, value) => {
		const matching = skus.filter(s => {
			if (s.attributes[key] !== value) return false

			return otherKeys.every(k => !selections[k] || s.attributes[k] === selections[k])
		})

		acc[value] = {
			exists: matching.length > 0,
			availableExists: matching.some(s => s.available)
		}

		return acc
	}, {})
}

// Find selected SKU
function findSelectedSku(skus, attributeKeys, selections) {
	if (Object.keys(selections).length < attributeKeys.length) return null

	return skus.find(s => attributeKeys.every(k => s.attributes[k] === selections[k])) || null
}

const COLOR_ATTRIBUTE_NAMES = ['cor', 'color', 'cor do produto', 'cores']

export const COR_MAP = {
	azul: '#3b5bdb',
	vermelho: '#e03131',
	vermelha: '#e03131',
	verde: '#2f9e44',
	preto: '#212529',
	preta: '#212529',
	branco: '#f8f9fa',
	branca: '#f8f9fa',
	amarelo: '#f59f00',
	amarela: '#f59f00',
	rosa: '#e64980',
	cinza: '#868e96',
	marrom: '#6f4e37'
}

function ColorSwatch({ color, selected, status, onClick }) {
	const hex = COR_MAP[color?.toLowerCase()] || color
	const unavailable = !status.availableExists
	const inexistent = !status.exists

	return (
		<View
			onClick={onClick}
			className={`
				relative w-6 h-6 rounded-full  transition-all duration-200
				flex items-center justify-center scale-110
				${selected ? 'ring-1 ring-primary' : 'ring-1 ring-[#D5D5D5]'}
				${unavailable && !inexistent ? 'opacity-50' : ''}
				${inexistent ? 'opacity-20 cursor-not-allowed' : ''}
			`}
			style={{ backgroundColor: hex || '#aaa' }}>
			{unavailable && !inexistent && (
				<View className='absolute inset-0 flex items-center justify-center rounded-full overflow-hidden'>
					<View className='absolute w-[120%] h-[1.5px] bg-white opacity-70 rotate-45' />
				</View>
			)}
		</View>
	)
}

function OptionChip({ value, selected, status, onClick }) {
	const unavailable = !status.availableExists
	const inexistent = !status.exists

	return (
		<View
			onClick={!inexistent ? onClick : undefined}
			className={`
				relative flex justify-center items-center min-w-8 min-h-8 p-[8px] rounded border text-sm font-medium transition-all duration-200 select-none
				${inexistent ? 'opacity-20 cursor-not-allowed border-gray-200 text-gray-400' : ''}
				${
					selected
						? 'bg-gray-100 border-red-700 text-red-700'
						: unavailable && !inexistent
							? 'bg-[#F9F9F9] text-[#B4B4B4] border-[#E6E6E6]'
							: 'bg-gray-100 text-gray-700 border-[#D5D5D5] active:bg-gray-50'
				}
			`}>
			<Text>{value}</Text>

			{unavailable && !inexistent && (
				<View className='absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden pointer-events-none'>
					<View className='absolute w-12 h-[1.5px] bg-[#E6E6E6] rotate-45' />
				</View>
			)}
		</View>
	)
}

export default function SkuSelector(props) {
	const { product, currentSku, onSkuChange, hideColorAttribute } = props

	const [selections, setSelections] = useState({})

	useEffect(() => {
		if (!currentSku?.variations?.length) {
			setSelections({})

			return
		}

		const currentSelection = currentSku?.variations?.reduce((acc, variation) => {
			if (variation.name && variation.values?.[0]) {
				acc[variation.name] = variation.values[0]
			}

			return acc
		}, {})

		setSelections(currentSelection)
	}, [currentSku])

	const skus = useMemo(() => {
		const hiddenVariations = RemoteConfig.getContent('appConfigs.pdp.hiddenVariations') || []

		const res = product?.items?.map(item => {
			const sellerDefault = item?.sellers?.find(s => s.sellerDefault) ?? item.sellers[0]

			return {
				itemId: item.itemId,
				available: sellerDefault.commertialOffer.AvailableQuantity > 0,
				attributes: item?.variations?.reduce((acc, item) => {
					if (hiddenVariations?.includes(item.name)) return acc

					acc[item.name] = item.values?.[0] ?? null

					return acc
				}, {})
			}
		})

		return res?.filter(sku => Object.keys(sku.attributes).length > 0)
	}, [product])

	const attributeKeys = useMemo(() => {
		if (!skus?.length) return []

		// Quando há variantes de cor entre produtos (ColorVariants), a troca de cor acontece por lá,
		// então some com o atributo "Cor" daqui pra não duplicar o seletor
		let keys = Object.keys(skus[0].attributes)

		if (hideColorAttribute) {
			keys = keys.filter(key => !COLOR_ATTRIBUTE_NAMES.includes(key.toLowerCase()))
		}

		// Ensure "Tamanho" (size) appears first when present
		const idx = keys.indexOf('Tamanho')

		if (idx > -1) {
			keys.splice(idx, 1)
			keys.unshift('Tamanho')
		}

		return keys
	}, [skus, hideColorAttribute])

	const handleSelect = (key, value) => {
		const isSame = selections[key] === value

		if (isSame) return

		const next = { ...selections, [key]: value }
		const newSku = findSelectedSku(skus, attributeKeys, next)

		onSkuChange?.(newSku)
	}

	if (attributeKeys.length === 0) return null

	return (
		<View className='flex flex-col gap-4 w-full'>
			{attributeKeys.map(key => {
				const values = getUniqueValues(skus, key)
				const statusMap = getOptionStatus(skus, attributeKeys, key, selections)
				const isCor = COLOR_ATTRIBUTE_NAMES.includes(key.toLowerCase())

				return (
					<View key={key}>
						<View className='flex items-center gap-2 mb-3'>
							<Text className='text-sm leading-6 font-semibold capitalize'>{key.toLowerCase()}</Text>
						</View>

						{isCor ? (
							<View className='flex flex-wrap gap-3'>
								{values.map(value => (
									<ColorSwatch
										key={value}
										color={value}
										selected={selections[key] === value}
										status={statusMap[value]}
										onClick={() => handleSelect(key, value)}
									/>
								))}
							</View>
						) : (
							<View className='flex flex-wrap gap-2'>
								{sortSku(values).map(value => (
									<OptionChip
										key={value}
										value={value}
										selected={selections[key] === value}
										status={statusMap[value]}
										onClick={() => handleSelect(key, value)}
									/>
								))}
							</View>
						)}
					</View>
				)
			})}
		</View>
	)
}
