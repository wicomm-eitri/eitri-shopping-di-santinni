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
import iconeEntrega from '../assets/icons/Entrega.svg'
import iconePagamentoAprovado from '../assets/icons/PagamentoAprovado.svg'
import iconeEntregue from '../assets/icons/entregue.svg'
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

	if (!order) {
		return null
	}

	const payInfo = getPaymentDetails()
	const itemsToShow = showAllItems ? order.items : order.items.slice(0, 2)

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
					<View className='flex flex-row items-start justify-center w-full mb-8 mt-6'>
						<View className='flex flex-col items-center w-[85px]'>
							<Image
								src={iconePagamentoAprovado}
								width={28}
								height={28}
								className='mb-2 object-contain'
							/>
							<Text className='text-[10px] text-black text-center leading-tight'>Enviado</Text>
						</View>

						<View className='h-[2px] w-[50px] bg-[#E2002B] mt-3 -mx-4 z-0' />

						<View className='flex flex-col items-center w-[85px]'>
							<Image
								src={iconeEntrega}
								width={28}
								height={28}
								className='mb-2 object-contain'
							/>
							<Text className='text-[10px] text-gray-500 font-medium text-center leading-tight'>
								Saiu para entrega
							</Text>
						</View>

						<View className='h-[2px] w-[50px] bg-gray-300 mt-3 -mx-4 z-0' />

						<View className='flex flex-col items-center w-[85px]'>
							<Image
								src={iconeEntregue}
								width={28}
								height={28}
								className='mb-2 object-contain'
							/>
							<Text className='text-[10px] text-gray-500 font-medium text-center leading-tight'>
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
									<Text className='text-xs text-gray-500'>{`Valor: ${formatPriceInCents(item.price)}`}</Text>
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
