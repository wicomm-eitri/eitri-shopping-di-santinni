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
		onChangeQuantity,
		actionButtonCustomColor,
		className = ''
	} = props

	const _onPressOnWishlist = e => {
		e.stopPropagation()
		onPressOnWishlist()
	}

	return (
		<View
			onClick={onPressOnCard}
			className={`relative border-[0.5px] border-neutral-300 bg-white rounded ${className}`}>
			<View className='flex flex-col w-full'>
				<View className='relative flex flex-col w-full justify-center items-center rounded-t h-[240px] min-h-[240px] max-h-[240px]'>
					{badge && (
						<View className='absolute top-2 left-2 rounded-full flex items-center justify-center h-4 w-[37px] bg-red-700'>
							<Text className='font-semibold text-white text-sm uppercase'>{badge}</Text>
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
					<View>
						{brand && (
							<Text className='font-bold text-xs text-neutral-500'>{brand}</Text>
						)}
						<Text className='line-clamp-1 break-words font-medium text-xs mb-2'>{name}</Text>
					</View>

					<View className='flex items-center gap-1.5'>
						<Text className='text-secondary text-xs'>{price}</Text>

						{showListItem && listPrice && (
							<Text className='line-through text-neutral-500 text-[10px]'>{listPrice}</Text>
						)}
					</View>

					{installments ? (
						<Text className='text-neutral-500 text-xs'>{installments}</Text>
					) : (
						<View className='h-4' />
					)}
				</View>

				<View
					onClick={e => {
						e.stopPropagation()
						onPressCartButton()
					}}
					className={`mt-2 h-[36px] bg-primary w-full rounded-b flex justify-center items-center border-primary-700 border-[0.5px] bg-primary z-[99]`}
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

				{/* <View
					onClick={e => {
						e.stopPropagation()
						onChangeQuantity(0)
					}}
					className={`mt-2 h-[36px] bg-primary w-full rounded-b flex justify-center items-center border-primary-700 border-[0.5px] bg-primary-700 z-[99]`}>
					{loadingCartOp ? (
						<Loading width='36px' />
					) : (
						<Text className='text-primary-content font-medium text-xs'>Remover</Text>
					)}
				</View> */}
			</View>
		</View>
	)
}
