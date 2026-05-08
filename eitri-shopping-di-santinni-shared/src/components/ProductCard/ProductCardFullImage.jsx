// import Loading from '../Loading/LoadingComponent'
import WishlistIcon from './components/WishlistIcon'

export default function ProductCardFullImage(props) {
	const {
		brand,
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
		actionButtonCustomColor,
		className = ''
	} = props

	const displayBadge = badge

	const _onPressOnWishlist = e => {
		e.stopPropagation()
		onPressOnWishlist()
	}

	return (
		<View
			onClick={onPressOnCard}
			className={`relative bg-white rounded-[24px] w-full max-w-[224px] h-[412px] flex flex-col overflow-hidden ${className}`}>
			<View className='flex flex-col w-full h-full'>
				<View className='relative flex flex-col w-full justify-center items-center h-[202px] flex-shrink-0'>
					{displayBadge && (
						<View className='absolute top-3 left-3 rounded-full bg-red-700 flex flex-row items-center justify-center h-[24px] min-w-[44px] px-2 gap-1'>
							<Text className='font-bold text-white text-xs leading-none'>{displayBadge}</Text>
						</View>
					)}

					<Image
						className='object-cover h-full w-full'
						src={image}
					/>

					<View
						onClick={_onPressOnWishlist}
						className='absolute top-1 right-2 p-2 flex items-center justify-center z-[99]'>
						<WishlistIcon
							filled={isOnWishlist}
							className='text-[#555555]'
							size='20'
						/>
					</View>
				</View>

				<View className='flex flex-col w-full flex-1 px-2 pt-5 pb-8 gap-2'>
					{/* Marca e Nome do Produto */}
					<View className='flex flex-col gap-0.5'>
						{brand && <Text className='text-[#888888] text-[10px] font-semibold uppercase'>{brand}</Text>}
						<Text className='text-black text-sm font-medium line-clamp-2 leading-tight'>{name}</Text>
					</View>

					{/* Bloco de Preço e Parcelamento */}
					<View className='flex flex-col gap-0.5'>
						<View>
							{showListItem && listPrice && (
								<Text className='line-through text-[#888888] text-xs'>{listPrice}</Text>
							)}
						</View>
						<View className='flex items-end gap-1.5'>
							<Text className='font-bold text-red-700 text-lg'>{price}</Text>
						</View>

						{/* Texto de parcelamento logo abaixo do preço */}
						{installments ? (
							<Text className='text-[#888888] text-xs font-semibold'>{installments}</Text>
						) : (
							<View className='h-3' />
						)}
					</View>

					{/* Botão de Ação */}
					<View
						onClick={e => {
							e.stopPropagation()
							onPressCartButton()
						}}
						className={`mt-auto h-10 bg-red-700 w-full rounded-full flex justify-center items-center px-3 bg-primary z-[99]`}
						style={{
							...(actionButtonCustomColor && {
								backgroundColor: actionButtonCustomColor
							})
						}}>
						{loadingCartOp ? (
							<Loading width='36px' />
						) : (
							<Text className='text-white font-bold text-xs'>{actionLabel}</Text>
						)}
					</View>
				</View>
			</View>
		</View>
	)
}
