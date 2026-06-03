import { useTranslation } from 'eitri-i18n'
import { CustomInput, CustomButton } from 'eitri-shopping-di-santinni-shared'
import CloseIcon from '../../assets/icons/close-cart.svg'
import { useLocalShoppingCart } from '../../providers/LocalCart'

export default function Coupon(props) {
	const { cart, addCoupon, removeCoupon } = useLocalShoppingCart()

	const [coupon, setCoupon] = useState('')
	const [appliedCoupon, setAppliedCoupon] = useState('')
	const [invalidCoupon, setInvalidCoupon] = useState(false)
	const [couponTextAlert, setCouponTextAlert] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const { t } = useTranslation()

	useEffect(() => {
		if (cart?.marketingData?.coupon) {
			setInvalidCoupon(false)
			setAppliedCoupon(cart.marketingData.coupon)

			if (coupon === cart?.marketingData?.coupon) {
				setCouponTextAlert(t('coupon.txtAppliedCoupon', 'Cupom aplicado!'))
			}
		} else {
			const errorMessage = cart?.messages || []
			const couponError = coupon && errorMessage.find(message => message.text.includes(coupon))

			if (couponError) {
				if (couponError.code === 'couponNotFound') {
					setCouponTextAlert(t('coupon.txtInvalidCoupon', 'Cupom inválido'))
				} else if (couponError.code === 'couponExpired') {
					setCouponTextAlert(t('coupon.txtExpiredCoupon', 'Cupom Expirado'))
				}

				setInvalidCoupon(true)
			} else {
				setInvalidCoupon(false)
				setAppliedCoupon('')
			}
		}
	}, [cart])

	const inputOnChange = value => setCoupon(value)

	const onPressAddCoupon = () => {
		setIsLoading(true)
		addCoupon(coupon)
		setIsLoading(false)
	}

	const onPressRemoveCoupon = () => {
		setCoupon('')
		setCouponTextAlert('')
		removeCoupon()
	}

	if (!cart) return null

	return (
		<View className='px-4'>
			<View className='mt-2 flex gap-8 justify-between items-center'>
				{appliedCoupon ? (
					<View className='flex items-center w-full gap-4'>
						<View className='relative flex items-center px-2 h-10 border-b border-gray-300 w-2/3'>
							<Text className='text-xs text-gray-500'>{appliedCoupon}</Text>

							<Image
								src={CloseIcon}
								alt='Ícone de fechar carrinho'
								className='absolute right-2 top-1/2 -translate-y-1/2'
								onClick={onPressRemoveCoupon}
							/>
						</View>

						<View className='w-1/3'>
							<CustomButton
								variant='outlined'
								isLoading={isLoading}
								label={t('coupon.txtAdd', 'APLICAR')}
								className='!border-x-0 !border-t-0 !border-gray-300 !rounded-none !h-10'
								textClassName='!text-xs !font-normal !text-xs'
							/>
						</View>
					</View>
				) : (
					<>
						<View className='flex justify-between mt-2 items-center w-full'>
							<View className='w-2/3'>
								<CustomInput
									placeholder={t('coupon.labelInsertCode', 'Insira o código')}
									value={coupon}
									className='!border-x-0 !border-t-0 !rounded-none !border-gray-300 !h-10  !text-xs text-gray-500 !pl-2'
									onChange={e => inputOnChange(e.target.value)}
								/>
							</View>

							<View className='w-1/3'>
								<CustomButton
									variant='outlined'
									isLoading={isLoading}
									label={t('coupon.txtAdd', 'APLICAR')}
									className='!border-x-0 !border-t-0 !rounded-none !border-gray-300 !h-10'
									textClassName='!text-xs !font-normal !text-xs'
									onPress={onPressAddCoupon}
								/>
							</View>
						</View>
					</>
				)}
			</View>

			{couponTextAlert && (
				<View className='mt-1'>
					<Text className={`text-xs ${invalidCoupon ? 'text-error' : 'text-success'}`}>
						{couponTextAlert}
					</Text>
				</View>
			)}

			<View className={'h-[10px]'} />
		</View>
	)
}
