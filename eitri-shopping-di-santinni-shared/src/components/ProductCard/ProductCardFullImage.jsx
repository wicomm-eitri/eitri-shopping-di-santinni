import Loading from '../Loading/LoadingComponent'
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
			className={`relative border-[0.5px] border-neutral-300 bg-white rounded ${className}`}>
			<View className='flex flex-col w-full'>
				<View className='relative flex flex-col w-full justify-center items-center rounded-t h-[240px] min-h-[240px] max-h-[240px] bg-[#F6F6F6]'>
					{badge && (
						<View className='absolute top-2 left-2 rounded-full flex items-center justify-center h-4 w-[37px] bg-red-700'>
							<Text className='font-semibold text-white text-sm uppercase'>{badge}</Text>
						</View>
					)}

					<Image
						className='object-contain h-full w-full mix-blend-multiply'
						src={image}
					/>

					<View
						onClick={_onPressOnWishlist}
						className='absolute top-1 right-2 p-2 flex items-center justify-center z-[99]'>
						<WishlistIcon
							filled={isOnWishlist}
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
