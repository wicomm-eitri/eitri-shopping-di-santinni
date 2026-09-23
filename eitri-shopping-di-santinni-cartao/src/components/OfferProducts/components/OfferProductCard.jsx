import { formatPrice } from '../../../utils/utils'
import WishlistIcon from '../../WishlistIcon/WishlistIcon'

export default function OfferProductCard(props) {
	const { product, isOnWishlist, onPress, onToggleWishlist } = props

	return (
		<View
			className='flex-1 h-[119px] overflow-hidden rounded-lg bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'
			onClick={onPress}>
			<View className='relative w-full h-[68px] bg-[#E9EDEE]'>
				<Image
					src={product.image}
					alt={product.name}
					className='w-full h-full object-contain mix-blend-multiply'
				/>

				<View
					className='absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-white'
					onClick={event => {
						event?.stopPropagation?.()
						onToggleWishlist()
					}}>
					<WishlistIcon
						filled={isOnWishlist}
						size={12}
					/>
				</View>
			</View>

			<View className='flex flex-col justify-between h-9 mt-2 px-[10px]'>
				<Text className='truncate text-[11px] leading-3 text-[#555555]'>{product.name}</Text>

				<Text className='text-xs leading-[14px] text-black'>{formatPrice(product.price)}</Text>

				{product.installments && (
					<Text className='text-[8px] leading-[10px] text-[#C8102E]'>
						{product.installments.count}x de {formatPrice(product.installments.value)}
					</Text>
				)}
			</View>
		</View>
	)
}
