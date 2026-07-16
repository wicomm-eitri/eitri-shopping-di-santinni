import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import {
	BottomInset,
	CustomButton,
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	Loading
} from 'eitri-shopping-di-santinni-shared'
import ImageCard from '../components/Image/ImageCard'
import ProtectedView from '../components/ProtectedView/ProtectedView'
import { getOrderById } from '../services/CustomerService'
import { sendScreenView } from '../services/TrackingService'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'
import { formatPriceInCents } from '../utils/utils'

export default function OrderDetails(props) {
	const [order, setOrder] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [showAllItems, setShowAllItems] = useState(false)

	const { t } = useTranslation()

	useEffect(() => {
		const { order, orderId } = props?.history?.location?.state || {}

		if (order) {
			setOrder(order)
		} else if (orderId) {
			handleOrder(orderId)
		} else {
			Eitri.navigation.back()

			return
		}

		addonUserTappedActiveTabListener()
		sendScreenView('Detalhes do pedido', 'OrderDetails')
	}, [])

	const handleOrder = async id => {
		setIsLoading(true)

		try {
			const orderData = await getOrderById(id)

			setOrder(orderData)
		} catch (error) {
			console.error(t('orderDetails.errors.getOrder', 'Erro ao pegar detalhes do pedido:'), error)
			Eitri.navigation.back()
		} finally {
			setIsLoading(false)
		}
	}

	const formatOrderDateTime = isoString => {
		if (!isoString) return ''

		const date = new Date(isoString)
		const day = String(date.getDate()).padStart(2, '0')
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const year = date.getFullYear()
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')

		return `${day}/${month}/${year} às ${hours}:${minutes}`
	}

	const getDeliveryDateText = () => {
		const info = order?.shippingData?.logisticsInfo?.[0]

		if (!info) return ''

		if (info.shippingEstimateDate) {
			const date = new Date(info.shippingEstimateDate)
			const day = String(date.getDate()).padStart(2, '0')
			const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')

			return `${day} ${month}`
		} else if (info.shippingEstimate) {
			return info.shippingEstimate.replace(/[a-zA-Z]/g, '') + ' dias úteis'
		}

		return ''
	}

	const getPaymentDetails = () => {
		const payment = order?.paymentData?.transactions?.[0]?.payments?.[0]

		if (!payment) return null

		return {
			name: payment.paymentSystemName,
			installments: payment.installments > 1 ? `em ${payment.installments}x sem juros` : 'à vista',
			value: payment.value,
			isCreditCard: payment.paymentSystem !== '6'
		}
	}

	const getTotalValue = () => {
		if (order?.totals) {
			return order.totals.map(item => item.value).reduce((acc, curr) => acc + curr, 0)
		}

		return order?.value || 0
	}

	if (isLoading) {
		return (
			<Page>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('orderDetails.title', 'Meus pedidos')} />
				</HeaderContentWrapper>
				<Loading fullScreen />
			</Page>
		)
	}

	if (!order) return null

	const payInfo = getPaymentDetails()
	const itemsToShow = showAllItems ? order.items : order.items.slice(0, 2)

	const status = order?.status
	const isDispatched = status === 'dispatched' || status === 'delivered'
	const isDelivered = status === 'delivered'

	return (
		<ProtectedView
			afterLoginRedirectTo={'OrderDetails'}
			redirectState={{ orderId: order?.orderId }}>
			<Page className='bg-gray-50'>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('orderDetails.title', 'Meus pedidos')} />
				</HeaderContentWrapper>

				<View className='p-4 bg-gray-50 flex-1 flex flex-col w-full'>
					{/* Header infos */}
					<View className='flex flex-col items-center justify-center gap-2 pt-2'>
						<Text className='text-red-700 font-bold text-sm mb-1'>{`Nº do pedido: ${order?.orderId}`}</Text>

						<Text className='text-gray-500 text-xs mb-3'>
							{`Realizado em: ${formatOrderDateTime(order?.creationDate)}`}
						</Text>

						<Text className='text-gray-500 text-sm'>
							{`Data prevista para a entrega: `}
							<Text className='font-semibold text-gray-700'>{getDeliveryDateText()}</Text>
						</Text>
					</View>

					{/* Timeline / Status */}
					<View className='flex items-start justify-center w-full mb-8 mt-6'>
						<View className='flex flex-col items-center w-[85px]'>
							<svg
								width={28}
								height={28}
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
								className={`mb-2 ${isDispatched ? 'text-red-700' : 'text-gray-300'}`}>
								<path d='M11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73Z' />
								<path d='M12 22V12' />
								<path d='M3.28906 7L11.9991 12L20.7091 7' />
								<path d='M7.5 4.27L16.5 9.42' />
							</svg>

							<Text
								className={`text-[10px] text-center leading-tight ${isDispatched ? 'text-red-700 font-bold' : 'text-gray-300 font-medium'}`}>
								Enviado
							</Text>
						</View>

						<View
							className={`h-[2px] w-[50px] mt-3 -mx-4 z-0 ${isDispatched ? 'bg-[#E2002B]' : 'bg-gray-300'}`}
						/>

						<View className='flex flex-col items-center w-[85px]'>
							<svg
								width={28}
								height={28}
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
								className={`mb-2 ${isDelivered ? 'text-red-700' : 'text-gray-300'}`}>
								<path d='M14 18V6C14 5.46957 13.7893 4.96086 13.4142 4.58579C13.0391 4.21071 12.5304 4 12 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H5' />
								<path d='M15 18H9' />
								<path d='M19 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17V13.35C21.9996 13.1231 21.922 12.903 21.78 12.726L18.3 8.376C18.2065 8.25888 18.0878 8.16428 17.9528 8.0992C17.8178 8.03412 17.6699 8.00021 17.52 8H14' />
								<path d='M17 20C18.1046 20 19 19.1046 19 18C19 16.8954 18.1046 16 17 16C15.8954 16 15 16.8954 15 18C15 19.1046 15.8954 20 17 20Z' />
								<path d='M7 20C8.10457 20 9 19.1046 9 18C9 16.8954 8.10457 16 7 16C5.89543 16 5 16.8954 5 18C5 19.1046 5.89543 20 7 20Z' />
							</svg>

							<Text
								className={`text-[10px] text-center leading-tight ${isDelivered ? 'text-red-700 font-bold' : 'text-gray-300 font-medium'}`}>
								Saiu para entrega
							</Text>
						</View>

						<View
							className={`h-[2px] w-[50px] mt-3 -mx-4 z-0 ${isDelivered ? 'bg-[#E2002B]' : 'bg-gray-300'}`}
						/>

						<View className='flex flex-col items-center w-[85px]'>
							<svg
								width={28}
								height={28}
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
								className={`mb-2 ${isDelivered ? 'text-red-700' : 'text-gray-300'}`}>
								<path d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' />
								<path d='M7.5 12.1668L10.6667 15.3335L17 9.00016' />
							</svg>

							<Text
								className={`text-[10px] text-center leading-tight ${isDelivered ? 'text-red-700 font-bold' : 'text-gray-300 font-medium'}`}>
								Entregue
							</Text>
						</View>
					</View>

					{/* Items */}
					<View className='flex flex-col gap-4 mb-6'>
						{itemsToShow.map(item => (
							<View
								key={item.uniqueId}
								className='bg-white p-3 flex flex-row gap-4 items-center rounded-lg shadow-sm border border-transparent'>
								<View className='bg-[#F4F4F4] p-2 rounded-md h-[90px] w-[90px] flex items-center justify-center'>
									<ImageCard
										imageUrl={item.imageUrl}
										className='w-[80px] h-[80px] object-contain mix-blend-multiply'
									/>
								</View>

								<View className='flex flex-col flex-1 justify-center'>
									<Text className='text-xs text-black mb-2 leading-tight'>{item.name}</Text>

									<Text className='text-xs text-gray-500'>
										{`Valor: ${formatPriceInCents(item.price)}`}
									</Text>
								</View>
							</View>
						))}

						{order.items.length > 2 && !showAllItems && (
							<View className='mt-2'>
								<CustomButton
									label='VER MAIS'
									variant='outlined'
									className='uppercase !h-[42px] rounded-full border border-red-700 w-full bg-white'
									textClassName='font-bold text-red-700 text-[11px]'
									onPress={() => setShowAllItems(true)}
								/>
							</View>
						)}
					</View>

					{/* Payment Info */}
					{payInfo && (
						<View className='bg-white p-4 rounded-lg shadow-sm mb-6 border border-transparent'>
							<View className='flex flex-row justify-between items-center mb-4'>
								<Text className='text-red-700 font-semibold'>{payInfo.name}</Text>
							</View>

							<Text className='text-gray-500 text-sm mb-4 leading-relaxed'>
								{order?.status === 'payment-pending'
									? 'O pagamento do seu pedido está em análise. Aguarde a confirmação para darmos sequência ao envio.'
									: order?.status === 'canceled' || order?.status === 'request-cancel'
										? 'O pedido e o seu pagamento foram cancelados.'
										: payInfo.isCreditCard
											? 'O pagamento via cartão de crédito foi aprovado e já foi processado com sucesso. Sua compra está confirmada e será concluída em ambiente seguro.'
											: 'O seu pedido está confirmado. Acompanhe o status do pagamento e a entrega.'}
							</Text>

							<View className='flex flex-row justify-between items-center mt-4'>
								<Text className='text-red-700 font-medium text-sm'>
									{`Valor total pago: ${formatPriceInCents(getTotalValue())} ${payInfo.installments}`}
								</Text>
							</View>
						</View>
					)}
				</View>

				<BottomInset />
			</Page>
		</ProtectedView>
	)
}
