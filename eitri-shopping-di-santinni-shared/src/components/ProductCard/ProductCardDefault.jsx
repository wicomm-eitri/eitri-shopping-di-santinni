import Loading from '../Loading/LoadingComponent'
import WishlistIcon from './components/WishlistIcon'

export default function ProductCardDefault(props) {
	const {
		brand,
		listPrice,
		image,
		name,
		price,
		width,
		installments,
		loadingCartOp,
		loadingWishlistOp,
		isOnWishlist,
		showListItem,
		actionLabel,
		badge,
		onPressOnCard,
		onPressCartButton,
		onPressOnWishlist,
		className
	} = props

	return (
		<View className={`relative bg-transparent rounded-xl flex flex-col ${className}`}>
			<View className='flex flex-col w-full h-full'>
				{/* Top Image Container */}
				<View className='relative flex flex-col w-full justify-center items-center h-[180px] bg-[#F6F6F6] rounded-xl overflow-hidden mb-3'>
					{/* Badge */}
					{badge && (
						<View className='absolute top-3 left-3 z-[98] rounded-full bg-[#C61030] px-2 py-0.5'>
							<Text className='font-bold text-white text-[11px]'>{badge}</Text>
						</View>
					)}

					{/* Wishlist Icon */}
					<View
						className='absolute top-3 right-3 z-[98]'
						onClick={onPressOnWishlist}>
						<WishlistIcon filled={isOnWishlist} />
					</View>

					<Image
						className='object-contain h-[130px] w-full'
						src={image}
					/>
				</View>

				{/* Brand */}
				<View className='flex min-h-[16px] mb-1'>
					{brand && <Text className='text-[#888888] text-[11px] font-medium uppercase'>{brand}</Text>}
				</View>

				{/* Name */}
				<View className='min-h-[44px] mb-2'>
					<Text
						className='text-[#1A1A1A] text-[15px] font-semibold leading-tight'
						numberOfLines={2}
						ellipsizeMode='tail'>
						{name}
					</Text>
				</View>

				{/* Prices */}
				<View className='flex flex-col gap-0.5 mb-4'>
					<Text
						className={`line-through font-bold text-[#888888] text-[12px] ${listPrice ? '' : 'opacity-0'}`}>
						{listPrice || 'R$ 000,00'}
					</Text>

					<Text className='font-bold text-[#C61030] text-[20px]'>{price}</Text>

					<Text className={`text-[#888888] text-[12px] ${installments ? '' : 'opacity-0'}`}>
						{installments || 'ou 0x de R$ 0,00 sem juros'}
					</Text>
				</View>

				{/* Button */}
				<View className='mt-auto flex justify-center items-center'>
					<View
						onClick={onPressCartButton}
						className='h-[42px] w-full rounded-full flex justify-center items-center bg-[#C61030] z-[99]'>
						{loadingCartOp ? (
							<Loading width='36px' />
						) : (
							<Text className='text-white font-bold text-[13px]'>{actionLabel}</Text>
						)}
					</View>
				</View>
			</View>

			<View
				className='absolute top-0 bottom-[50px] left-0 right-0 z-[90]'
				onClick={onPressOnCard}
			/>
		</View>
	)
}
