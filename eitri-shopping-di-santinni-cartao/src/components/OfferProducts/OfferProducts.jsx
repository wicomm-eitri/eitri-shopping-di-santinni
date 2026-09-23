import OfferProductCard from './components/OfferProductCard'

export default function OfferProducts(props) {
	const { products, wishlistIds = [], onPressSeeMore, onPressProduct, onToggleWishlist } = props

	return (
		<View className='flex flex-col gap-[10px]'>
			<View className='flex flex-row items-center justify-between'>
				<Text className='text-base font-semibold leading-6 text-black'>Ofertas para você</Text>

				<View onClick={onPressSeeMore}>
					<Text className='text-xs leading-4 text-[#C8102E] underline'>Ver mais</Text>
				</View>
			</View>

			<View className='flex flex-row w-full gap-[7px]'>
				{products.map(product => (
					<OfferProductCard
						key={product.id}
						product={product}
						isOnWishlist={wishlistIds.includes(String(product.id))}
						onPress={() => onPressProduct(product)}
						onToggleWishlist={() => onToggleWishlist(product)}
					/>
				))}
			</View>
		</View>
	)
}
