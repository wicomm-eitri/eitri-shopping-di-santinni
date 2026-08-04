import { useEffect, useMemo, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { createPortal } from 'react-dom'
import CustomButton from '../CustomButton/CustomButton'

const TRANSITION_MS = 300

const COLOR_MAP = {
	'preto': '#1a1a1a',
	'branco': '#ffffff',
	'off white': '#f5f0e8',
	'off-white': '#f5f0e8',
	'bege': '#d9c7a7',
	'nude': '#e3c4a8',
	'caramelo': '#a9671f',
	'marrom': '#5c3a1e',
	'cinza': '#8c8c8c',
	'chumbo': '#4a4a4a',
	'azul': '#1d4ed8',
	'marinho': '#1e2a5a',
	'vermelho': '#dc2626',
	'vinho': '#722030',
	'bordo': '#722030',
	'rosa': '#ec6aa0',
	'pink': '#e11d74',
	'verde': '#15803d',
	'militar': '#4d5d33',
	'amarelo': '#eab308',
	'laranja': '#ea580c',
	'lilas': '#b18ae0',
	'roxo': '#7e22ce',
	'dourado': '#d4af37',
	'prata': '#c0c0c0',
	'multicolorido': '#d1d5db'
}

const getVariationValue = (item, variationName) => {
	if (!item?.variations?.length) return ''

	const structured = item.variations.find(
		v => typeof v === 'object' && (v?.name || '').toLowerCase() === variationName
	)

	if (structured) return structured.values?.[0] || ''

	const legacyKey = item.variations.find(v => typeof v === 'string' && v.toLowerCase() === variationName)

	if (legacyKey) return item[legacyKey]?.[0] || ''

	return ''
}

const getItemSize = item => {
	const fromVariation = getVariationValue(item, 'tamanho')

	if (fromVariation) return fromVariation

	const last = (item?.name || '').trim().split(/\s+/).pop() || ''

	return /^[0-9./-]+$/.test(last) ? last : ''
}

const isItemAvailable = item => item?.sellers?.some(seller => seller?.commertialOffer?.AvailableQuantity > 0)

const getProductColor = product => {
	const directColor = product?.Cor || product?.cor || product?.Color || product?.color

	if (Array.isArray(directColor) && directColor[0]) return directColor[0]

	if (typeof directColor === 'string' && directColor) return directColor

	const property = product?.properties?.find(property => ['cor', 'color'].includes(property?.name?.toLowerCase()))
	const propertyColor = property?.values?.[0]

	if (propertyColor) return propertyColor

	const specification = product?.specificationGroups
		?.flatMap(group => group?.specifications || [])
		.find(spec => ['cor', 'color'].includes(spec?.name?.toLowerCase()))
	const specificationColor = specification?.values?.[0]

	if (specificationColor) return specificationColor

	return getVariationValue(product?.items?.[0], 'cor') || getVariationValue(product?.items?.[0], 'color')
}

const normalizeColor = color =>
	String(color || '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim()

const getMappedColor = color => {
	const normalized = normalizeColor(color)

	if (COLOR_MAP[normalized]) return COLOR_MAP[normalized]

	const colorName = Object.keys(COLOR_MAP).find(name => normalized.split(/\s*[/-]\s*|\s+/).includes(name))

	return colorName ? COLOR_MAP[colorName] : ''
}

const formatColorLabel = raw => (raw ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase() : '')

export default function ModalSkuSelector(props) {
	const { product, show, onClose, onConfirm, initialColorVariants = [] } = props

	const [mounted, setMounted] = useState(false)
	const [visible, setVisible] = useState(false)
	const [currentProduct, setCurrentProduct] = useState(product)
	const [similars, setSimilars] = useState([])
	const [selectedItemId, setSelectedItemId] = useState(null)
	const [isAdding, setIsAdding] = useState(false)

	const sizes = useMemo(() => {
		if (!currentProduct?.items?.length) return []

		return currentProduct.items
			.map(item => ({
				item,
				size: getItemSize(item),
				available: isItemAvailable(item)
			}))
			.filter(entry => entry.size)
			.sort((a, b) => parseFloat(a.size) - parseFloat(b.size))
	}, [currentProduct])

	const selectedEntry = sizes.find(entry => entry.item.itemId === selectedItemId)

	const colorOptions = useMemo(() => {
		const base = [product, ...similars].filter(Boolean)
		const seen = new Set()
		const seenColors = new Set()

		return base
			.filter(p => {
				const id = String(p?.productId || p?.productReference || '')

				if (!id || seen.has(id)) return false

				seen.add(id)

				return true
			})
			.map(p => {
				const color = getProductColor(p)

				return {
					product: p,
					color,
					colorKey: normalizeColor(color),
					imageUrl: p?.items?.[0]?.images?.[0]?.imageUrl || ''
				}
			})
			.filter(option => {
				if (!option.colorKey || seenColors.has(option.colorKey)) return false

				seenColors.add(option.colorKey)

				return true
			})
	}, [product, similars])

	const currentColor = formatColorLabel(getProductColor(currentProduct))

	const images = useMemo(() => {
		const item = selectedEntry?.item || currentProduct?.items?.[0]

		return (item?.images || []).slice(0, 6).map(image => image.imageUrl)
	}, [currentProduct, selectedEntry])

	const selectFirstAvailable = targetProduct => {
		const entries = (targetProduct?.items || [])
			.map(item => ({ item, size: getItemSize(item), available: isItemAvailable(item) }))
			.filter(entry => entry.size)

		const firstAvailable = entries.find(entry => entry.available)

		setSelectedItemId(firstAvailable?.item?.itemId || null)
	}

	useEffect(() => {
		let transitionTimer

		if (show) {
			setCurrentProduct(product)
			setSimilars(initialColorVariants)
			selectFirstAvailable(product)
			setMounted(true)
			transitionTimer = setTimeout(() => setVisible(true), 50)
		} else if (mounted) {
			setVisible(false)
			transitionTimer = setTimeout(() => setMounted(false), TRANSITION_MS)
		}

		return () => clearTimeout(transitionTimer)
	}, [show, product, initialColorVariants])

	useEffect(() => {
		try {
			if (show) {
				Eitri.bottomBar.hide()
			} else {
				Eitri.bottomBar.show()
			}
		} catch (error) {
			console.error('Error updating bottom bar visibility', error)
		}

		return () => {
			if (!show) return

			try {
				Eitri.bottomBar.show()
			} catch (error) {
				console.error('Error restoring bottom bar visibility', error)
			}
		}
	}, [show])

	const handleSelectColor = option => {
		if (option.product === currentProduct) return

		setCurrentProduct(option.product)
		selectFirstAvailable(option.product)
	}

	const internalClose = () => {
		if (isAdding) return

		setVisible(false)
		setTimeout(() => onClose && onClose(), TRANSITION_MS)
	}

	const handleConfirm = async () => {
		if (!selectedEntry || isAdding) return

		try {
			setIsAdding(true)
			await onConfirm(selectedEntry.item, currentProduct)
			setVisible(false)
			setTimeout(() => onClose && onClose(), TRANSITION_MS)
		} catch (error) {
			console.error('Error adding selected SKU to cart:', error)
		} finally {
			setIsAdding(false)
		}
	}

	if (!mounted || !currentProduct) return null

	const modal = (
		<View
			className={`fixed inset-0 z-[99999] flex items-end justify-center overflow-hidden bg-black transition-opacity duration-300 ease-out ${visible ? 'bg-opacity-50' : 'bg-opacity-0'}`}>
			<View
				onClick={internalClose}
				className='absolute inset-0'
			/>

			<View
				className={`relative flex flex-col bg-white rounded-t-[24px] max-h-[85vh] w-full overflow-hidden transition-transform duration-300 ease-out ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
				<View className='flex justify-center pt-2.5'>
					<View className='w-16 h-[3px] rounded-full bg-[#737373]' />
				</View>

				<View className='flex flex-col gap-4 px-[22px] pt-4 pb-6 overflow-auto'>
					{images.length > 0 && (
						<View className='flex flex-row gap-3 overflow-x-auto'>
							{images.map((imageUrl, index) => (
								<Image
									key={index}
									src={imageUrl}
									className='h-24 w-24 min-w-24 object-contain'
								/>
							))}
						</View>
					)}

					<Text className='text-base font-bold text-neutral-900'>{currentProduct?.productName}</Text>

					<View className='flex flex-col gap-2'>
						<Text className='text-sm text-neutral-900'>
							{'Selecione o tamanho: '}
							<Text className='font-bold'>{selectedEntry?.size || ''}</Text>
						</Text>

						<View className='flex flex-row flex-wrap gap-2'>
							{sizes.map(entry => {
								const isSelected = entry.item.itemId === selectedItemId

								return (
									<View
										key={entry.item.itemId}
										onClick={() => entry.available && setSelectedItemId(entry.item.itemId)}
										className={`relative flex items-center justify-center w-9 h-9 rounded border overflow-hidden ${
											isSelected
												? 'border-[#D7092F] bg-[#FFF1F3]'
												: entry.available
													? 'border-[#D6D6D6] bg-[#F5F5F4]'
													: 'border-[#E5E5E5] bg-[#FAFAFA]'
										}`}>
										<Text
											className={`text-sm ${
												isSelected
													? 'text-[#D7092F] font-medium'
													: entry.available
														? 'text-[#404040]'
														: 'text-[#CFCFCF]'
											}`}>
											{entry.size}
										</Text>
										{!entry.available && (
											<View className='absolute w-11 h-px bg-[#E5E5E5] -rotate-45' />
										)}
									</View>
								)
							})}
						</View>
					</View>

					{(colorOptions.length > 1 || currentColor) && (
						<View className='flex flex-col gap-2'>
							<Text className='text-sm text-neutral-900'>
								{colorOptions.length > 1 ? 'Selecione a cor: ' : 'Cor: '}
								<Text className='text-[#737373] font-normal'>{currentColor}</Text>
							</Text>

							{colorOptions.length > 1 && (
								<View className='flex flex-row flex-wrap gap-3'>
									{colorOptions.map((option, index) => {
										const isSelected = option.product === currentProduct
										const mappedColor = getMappedColor(option.color)

										return (
											<View
												key={option.product?.productId || index}
												onClick={() => handleSelectColor(option)}
												className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
													isSelected ? 'border-red-700' : 'border-neutral-300'
												}`}>
												{mappedColor ? (
													<View
														className='w-6 h-6 rounded-full border border-neutral-200'
														style={{ backgroundColor: mappedColor }}
													/>
												) : (
													<Image
														src={option.imageUrl}
														className='w-6 h-6 rounded-full object-cover'
													/>
												)}
											</View>
										)
									})}
								</View>
							)}
						</View>
					)}

					<CustomButton
						label={'ADICIONAR AO CARRINHO'}
						isLoading={isAdding}
						disabled={!selectedEntry}
						onPress={handleConfirm}
						backgroundColor='bg-[#D7092F]'
						textClassName='text-xs'
						className='w-full !h-10 rounded-full'
					/>

					<View bottomInset='auto' />
				</View>
			</View>
		</View>
	)

	return typeof document !== 'undefined' ? createPortal(modal, document.body) : null
}
