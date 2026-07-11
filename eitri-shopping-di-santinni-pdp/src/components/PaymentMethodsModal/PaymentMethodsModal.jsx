import { useTranslation } from 'eitri-i18n'
import { LuCreditCard, LuQrCode, LuX } from 'react-icons/lu'
import { formatPrice } from '../../utils/utils'

const CREDIT_CARD_PAYMENT_SYSTEM = 'Mastercard'
const DS_CARD_PAYMENT_SYSTEM = 'Cartão DS'
const PIX_PAYMENT_SYSTEM = 'Pix'

// PIX sempre tem 5% de desconto fixo, mockado até a API retornar essa info
const PIX_DISCOUNT_PERCENT = 5

export default function PaymentMethodsModal(props) {
	const { showModal, closeModal, mainSeller } = props
	const { t } = useTranslation()

	const installments = mainSeller?.commertialOffer?.Installments || []

	const getInstallmentsBySystem = paymentSystemName =>
		installments
			.filter(installment => installment.PaymentSystemName === paymentSystemName)
			.sort((a, b) => a.NumberOfInstallments - b.NumberOfInstallments)

	const creditCardInstallments = getInstallmentsBySystem(CREDIT_CARD_PAYMENT_SYSTEM)
	const dsCardInstallments = getInstallmentsBySystem(DS_CARD_PAYMENT_SYSTEM)

	const pixBaseValue = getInstallmentsBySystem(PIX_PAYMENT_SYSTEM)[0]?.Value
	const pixValue = pixBaseValue ? pixBaseValue * (1 - PIX_DISCOUNT_PERCENT / 100) : null

	const InstallmentList = ({ list }) => (
		<View className='flex flex-col gap-2'>
			{list.map(installment => (
				<Text
					key={installment.NumberOfInstallments}
					className='text-xs text-gray-700'>
					{installment.NumberOfInstallments}x {t('mainDescription.txtOf', 'de')}{' '}
					{formatPrice(installment.Value)}{' '}
					{installment.InterestRate
						? t('paymentMethods.txtWithInterest', 'com juros')
						: t('paymentMethods.txtWithoutInterest', 'sem juros')}
				</Text>
			))}
		</View>
	)

	if (!showModal) return null

	return (
		<View className='fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 px-4'>
			<View
				onClick={closeModal}
				className='absolute inset-0'
			/>

			<View className='relative w-full max-w-md bg-white rounded-xl overflow-hidden'>
				<View className='flex items-center justify-between bg-red-700 px-3 py-2'>
					<Text className='text-white font-semibold'>
						{t('paymentMethods.txtTitle', 'Formas de Pagamento')}
					</Text>

					<View
						onClick={closeModal}
						className='p-1'>
						<LuX
							size={22}
							color='#fff'
						/>
					</View>
				</View>

				<View className='grid grid-cols-2 gap-2 p-3'>
					{creditCardInstallments.length > 0 && (
						<View className='bg-gray-100 rounded-lg p-3 flex flex-col gap-3'>
							<View className='flex items-center gap-2'>
								<View className='w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center'>
									<LuCreditCard
										size={14}
										color='#fff'
									/>
								</View>

								<Text className='font-semibold text-xs'>
									{t('paymentMethods.txtCreditCard', 'Cartão de Crédito')}
								</Text>
							</View>

							<InstallmentList list={creditCardInstallments} />
						</View>
					)}

					{dsCardInstallments.length > 0 && (
						<View className='bg-gray-100 rounded-lg p-4 flex flex-col gap-3'>
							<View className='flex items-center gap-2'>
								<View className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center'>
									<LuCreditCard
										size={14}
										color='#fff'
									/>
								</View>

								<Text className='font-semibold text-xs'>
									{t('paymentMethods.txtDSCard', 'Cartão Di Santinni')}
								</Text>
							</View>

							<InstallmentList list={dsCardInstallments} />
						</View>
					)}

					{pixValue && (
						<View className='bg-gray-100 rounded-lg p-4 flex flex-col gap-3'>
							<View className='flex items-center gap-2'>
								<View className='w-8 h-8 rounded-md bg-teal-500 flex items-center justify-center'>
									<LuQrCode
										size={14}
										color='#fff'
									/>
								</View>

								<Text className='font-semibold text-xs'>{t('paymentMethods.txtPix', 'PIX')}</Text>
							</View>

							<View className='flex items-center gap-1'>
								<Text className='text-xs text-green-600 font-semibold'>
									({PIX_DISCOUNT_PERCENT}% {t('paymentMethods.txtOff', 'OFF')})
								</Text>

								<Text className='text-xs font-semibold'>{formatPrice(pixValue)}</Text>
							</View>
						</View>
					)}
				</View>
			</View>
		</View>
	)
}
