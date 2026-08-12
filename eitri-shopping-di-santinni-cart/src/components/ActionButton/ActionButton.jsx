import { useTranslation } from 'eitri-i18n'
import { BottomInset } from 'eitri-shopping-di-santinni-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { requestLogin } from '../../services/customerService'
import { navigateToCheckout } from '../../services/navigationService'
import { formatAmountInCents } from '../../utils/utils'

export default function ActionButton(props) {
	const { disabled } = props
	const { cart } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [total, setTotal] = useState(0)

	const goToCheckout = async () => {
		if (isValidToProceed()) {
			try {
				await requestLogin()
				navigateToCheckout(cart?.orderFormId)
			} catch (e) {
				// User cancelled login or error occurred
			}
		}
	}

	const isValidToProceed = () => {
		if (disabled) return false

		if (!cart) return false

		if (!cart?.items) return false

		return cart?.items.length !== 0
	}

	useEffect(() => {
		if (!cart) return

		const items = getTotalizerById(cart.totalizers, 'Items')
		const discounts = getTotalizerById(cart.totalizers, 'Discounts')
		const shipping = getTotalizerById(cart.totalizers, 'Shipping')

		const total = (items?.value ?? 0) + (discounts?.value ?? 0) + (shipping?.value ?? 0)

		setTotal(total)
	}, [cart])

	const getTotalizerById = (totalizers, id) => totalizers.find(item => item.id === id)

	return (
		<>
			<View className='fixed bottom-0 left-0 w-full z-50 bg-base-100 border-t border-gray-300'>
				<View className='p-4'>
					<View
						onClick={() => {
							if (isValidToProceed()) {
								goToCheckout()
							}
						}}
						className={`flex justify-between items-center py-4 px-6 rounded-[100px] ${isValidToProceed() ? 'bg-red-700' : 'bg-gray-300'}`}>
						<Text className='text-sm text-white'>FINALIZAR</Text>

						{total > 0 && (
							<Text className='text-sm text-white font-bold'>{formatAmountInCents(total)}</Text>
						)}
					</View>
				</View>

				<BottomInset />
			</View>

			<View className={'h-[77px]'} />

			<BottomInset />
		</>
	)
}
