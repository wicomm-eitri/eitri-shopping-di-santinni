import { useTranslation } from 'eitri-i18n'
import { CustomButton } from 'eitri-shopping-di-santinni-shared'
import cartRed from '../../assets/images/cart-red.svg'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { openCart } from '../../services/NavigationService'

export default function ActionButton(props) {
	const { addItem, cart } = useLocalShoppingCart()
	const { t } = useTranslation()
	const { currentSku } = props
	const [isAvailable, setIsAvailable] = useState(true)
	const [isLoading, setLoading] = useState(false)

	useEffect(() => {
		const mainSeller = currentSku.sellers.find(seller => seller.sellerDefault)
		const isAvailable = mainSeller?.commertialOffer?.AvailableQuantity > 0

		setIsAvailable(isAvailable)
	}, [currentSku])

	const isItemOnCart = () => {
		return cart?.items?.some(cartItem => cartItem.id === currentSku?.itemId)
	}

	const getButtonLabel = () => {
		if (!isAvailable) return t('product.errorNoProduct', 'Produto Indisponível')

		return isItemOnCart()
			? t('product.labelGoToCart', 'Ir para carrinho')
			: t('product.labelAddToCart', 'Comprar agora')
	}

	const handleButtonClick = () => {
		if (!isAvailable) return

		setLoading(true)

		if (isItemOnCart()) {
			openCart()
		} else {
			addItem(currentSku)
		}

		setLoading(false)
	}

	return (
		<>
			{/* <View className='fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-300'> */}
			{/* <View className='p-4'> */}
			<View className='w-full flex items-center gap-2.5 justify-between'>
				<CustomButton
					onClick={handleButtonClick}
					isLoading={isLoading}
					disabled={!isAvailable}
					backgroundColor={isAvailable ? 'bg-red-700' : 'bg-neutral-300'}
					className='rounded-full !w-full'
					label={getButtonLabel()}
				/>
				<View className='rounded-full border w-[52px] h-[43px] border-red-700 flex items-center justify-center'>
					<Image src={cartRed} className='w-5 h-5' />
				</View>
				{/* TODO: Adicionar o botão de adicionar a sacola */}
			</View>
			{/* </View> */}

			{/* <BottomInset /> */}
			{/* </View> */}
			{/* <View>
				<View className='h-[77px] w-full' />
			</View> */}
		</>
	)
}
