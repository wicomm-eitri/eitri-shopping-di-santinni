import Loading from '../Loading/LoadingComponent'
import WishlistIcon from './components/WishlistIcon'

export default function ProductCardFullImage(props) {
	const {
		listPrice,
		image,
		name,
		price,
		installments,
		loadingCartOp,
		isOnWishlist,
		badge,
		showListItem,
		actionLabel,
		onPressOnCard,
		onPressCartButton,
		onPressOnWishlist,
		onChangeQuantity,
		actionButtonCustomColor,
		className = ''
	} = props

	const MOCK_DISCOUNT_PERCENT = 20

	const parseCurrencyValue = value => {
		if (typeof value === 'number') {
			return value
		}

		if (!value) {
			return null
		}

		const normalizedValue = `${value}`
			.replace(/[^\d,.-]/g, '')
			.replace(/\./g, '')
			.replace(',', '.')

		const parsedValue = Number(normalizedValue)

		return Number.isFinite(parsedValue) ? parsedValue : null
	}

	const formatMockCurrency = value => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value)
	}

	const currentPriceValue = parseCurrencyValue(price)
	const mockedListPrice =
		listPrice ||
		(currentPriceValue ? formatMockCurrency(currentPriceValue * (1 + MOCK_DISCOUNT_PERCENT / 100)) : '')
	const displayBadge = badge || (price ? `${MOCK_DISCOUNT_PERCENT}% off` : '')

	const _onPressOnWishlist = e => {
		e.stopPropagation()
		onPressOnWishlist()
	}

	return (
		<View
			onClick={onPressOnCard}
			className={`relative bg-white rounded ${className}`}>
			<View className='flex flex-col w-full'>
				<View className='relative flex flex-col w-full justify-center items-center rounded-t h-[240px] min-h-[240px] max-h-[240px]'>
					{displayBadge && (
						<View className='absolute top-2 left-2 rounded-full bg-red-700 flex items-center justify-center h-4 px-2'>
							<Text className='font-semibold text-[#FAFAF8] text-sm'>{displayBadge}</Text>
						</View>
					)}

					<Image
						className='object-contain h-full w-full rounded'
						src={image}
					/>

					<View
						onClick={_onPressOnWishlist}
						className='absolute top-1 right-2 p-2 flex items-center justify-center z-[99]'>
						<WishlistIcon
							filled={isOnWishlist}
							className={isOnWishlist ? 'text-primary' : 'text-neutral-100'}
							size='20'
						/>
					</View>
				</View>

				<View className='flex flex-col w-full p-2'>
					{/* Nome do Produto */}
					<Text className='text-black text-base mb-2 line-clamp-2'>{name}</Text>

					{/* Bloco de Preço e Parcelamento */}
					<View className='flex flex-col'>
						<View>
							{showListItem && mockedListPrice && (
								<Text className='line-through text-[#888888] text-sm mb-[2px]'>{mockedListPrice}</Text>
							)}
						</View>
						<View className='flex items-end gap-1.5'>
							<Text className='font-bold text-red-700 text-base'>{price}</Text>
						</View>

						{/* Texto de parcelamento logo abaixo do preço */}
						{installments ? (
							<Text className='text-[#888888] text-xs font-bold mt-0.5'>{installments}</Text>
						) : (
							<View className='h-4 mt-0.5' />
						)}
					</View>
				</View>

				{/* Botão de Ação */}
				<View
					onClick={e => {
						e.stopPropagation()
						onPressCartButton()
					}}
					className={`mt-2 h-[36px] bg-red-700 w-full rounded-full flex justify-center items-center border-primary-700 px-[9px] bg-primary z-[99]`}
					style={{
						...(actionButtonCustomColor && {
							backgroundColor: actionButtonCustomColor
						})
					}}>
					{loadingCartOp ? (
						<Loading width='36px' />
					) : (
						<Text className='text-primary-content font-medium text-xs'>{actionLabel}</Text>
					)}
				</View>
			</View>
		</View>
	)
}
