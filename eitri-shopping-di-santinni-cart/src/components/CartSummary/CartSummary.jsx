import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { formatAmountInCents } from '../../utils/utils'

export default function CartSummary(props) {
	const { cart } = useLocalShoppingCart()

	const [itemsValue, setItemsValue] = useState(0)
	const [discounts, setDiscounts] = useState(0)
	const [shipping, setShipping] = useState(0)
	const [total, setTotal] = useState(0)

	const { t } = useTranslation()

	useEffect(() => {
		if (!cart) return

		const items = getTotalizerById(cart.totalizers, 'Items')
		const discounts = getTotalizerById(cart.totalizers, 'Discounts')
		const shipping = getTotalizerById(cart.totalizers, 'Shipping')

		setItemsValue(items?.value || 0)
		setDiscounts(discounts?.value || 0)
		setShipping(shipping?.value || 0)

		const total = (items?.value ?? 0) + (discounts?.value ?? 0) + (shipping?.value ?? 0)

		setTotal(total)
	}, [cart])

	const getTotalizerById = (totalizers, id) => totalizers.find(item => item.id === id)

	if (total === 0) return null

	return (
		<View className='flex flex-col justify-center w-full px-4'>
			{itemsValue > 0 && (
				<View className='flex justify-between py-2'>
					<Text className='font-semibold'>{t('cartSummary.txtSubtotal', 'Subtotal')}</Text>
					<Text className='font-semibold'>{formatAmountInCents(itemsValue)}</Text>
				</View>
			)}

			{discounts > 0 && (
				<View className='flex justify-between py-2'>
					<Text className='text-sm'>{t('cartSummary.txtDiscount', 'Desconto')}</Text>
					<Text className='text-sm'>{formatAmountInCents(discounts)}</Text>
				</View>
			)}

			{shipping && (
				<View className='flex justify-between py-2'>
					<Text className='text-sm'>{t('cartSummary.txtDelivery', 'Entrega')}</Text>
					<Text className='text-sm'>{formatAmountInCents(shipping)}</Text>
				</View>
			)}
		</View>
	)
}
