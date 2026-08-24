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
import InfoCircleIcon from '../components/Icons/InfoCircleIcon'
import StepCurrentIcon from '../components/Icons/StepCurrentIcon'
import StepDoneIcon from '../components/Icons/StepDoneIcon'
import OrderStatusBadge from '../components/OrderStatusBadge/OrderStatusBadge'
import ProtectedView from '../components/ProtectedView/ProtectedView'
import { getOrderById } from '../services/CustomerService'
import { sendScreenView } from '../services/TrackingService'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'
import { formatDateDaysMonthYear, formatPriceInCents } from '../utils/utils'

const CONFIRMED_STATUSES = [
	'order-created',
	'payment-approved',
	'handling',
	'ready-for-handling',
	'invoiced',
	'ready-for-invoicing',
	'shipped',
	'dispatched',
	'delivered',
	'on-order-completed'
]
const PAID_STATUSES = [
	'payment-approved',
	'handling',
	'ready-for-handling',
	'invoiced',
	'ready-for-invoicing',
	'shipped',
	'dispatched',
	'delivered',
	'on-order-completed'
]
const PREPARED_STATUSES = [
	'handling',
	'ready-for-handling',
	'invoiced',
	'ready-for-invoicing',
	'shipped',
	'dispatched',
	'delivered',
	'on-order-completed'
]
const SHIPPING_STATUSES = ['invoiced', 'shipped', 'dispatched', 'delivered', 'on-order-completed']
const DELIVERED_STATUSES = ['delivered', 'on-order-completed']
const CANCELED_STATUSES = ['cancel', 'canceled', 'request-cancel', 'window-to-cancel']

export default function OrderDetails(props) {
	const [order, setOrder] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [showAllItems, setShowAllItems] = useState(false)
	const [showPaymentDetails, setShowPaymentDetails] = useState(false)

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

	const formatQuantity = quantity => {
		const qty = quantity || 1

		return `${qty} ${qty === 1 ? t('orderDetails.unit', 'unidade') : t('orderDetails.units', 'unidades')}`
	}

	const getAddress = () => {
		const address = order?.shippingData?.address

		if (!address) return null

		return {
			receiverName: address.receiverName,
			formattedAddress: `${address.street || ''}${address.number ? `, ${address.number}` : ''}`,
			neighborhood: address.neighborhood,
			city: address.city,
			state: address.state,
			country: address.country === 'BRA' ? 'Brasil' : address.country,
			postalCode: address.postalCode
		}
	}

	const getPaymentDetails = () => {
		const payment = order?.paymentData?.transactions?.[0]?.payments?.[0]

		if (!payment) return null

		return {
			name: payment.paymentSystemName,
			installments: payment.installments || 1,
			value: payment.value,
			cardLastDigits: payment.cardLastDigits,
			tid: payment.tid,
			isCreditCard: payment.group === 'creditCardPaymentGroup' || payment.paymentSystem !== '6'
		}
	}

	const getTotalByGroup = groupId => {
		return order?.totals?.find(total => total.id === groupId)?.value || 0
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

	const address = getAddress()
	const payInfo = getPaymentDetails()
	const hasPaymentAdditionalInfo = Boolean(order?.authorizedDate || payInfo?.tid)
	const itemsToShow = showAllItems ? order.items : order.items.slice(0, 2)

	const status = order?.status
	const isCanceled = CANCELED_STATUSES.includes(status)

	const stepsDone = [
		{ label: t('orderDetails.steps.confirmed', 'Pedido confirmado'), done: CONFIRMED_STATUSES.includes(status) },
		{ label: t('orderDetails.steps.paid', 'Pagamento aprovado'), done: PAID_STATUSES.includes(status) },
		{ label: t('orderDetails.steps.prepared', 'Pedido preparado'), done: PREPARED_STATUSES.includes(status) },
		{ label: t('orderDetails.steps.shipping', 'Enviando pedido'), done: SHIPPING_STATUSES.includes(status) },
		{ label: t('orderDetails.steps.delivered', 'Entregar pedido'), done: DELIVERED_STATUSES.includes(status) }
	]

	const lastDoneIndex = stepsDone.reduce((acc, step, index) => (step.done ? index : acc), -1)
	const isFullyDelivered = lastDoneIndex === stepsDone.length - 1

	const steps = stepsDone.map((step, index) => ({
		...step,
		isCurrent: step.done && index === lastDoneIndex && !isFullyDelivered
	}))

	return (
		<ProtectedView
			afterLoginRedirectTo={'OrderDetails'}
			redirectState={{ orderId: order?.orderId }}>
			<Page className='bg-gray-50'>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('orderDetails.title', 'Meus pedidos')} />
				</HeaderContentWrapper>

				<View className='p-4 bg-gray-50 flex-1 flex flex-col w-full gap-3 mt-3'>
					{/* Header infos */}
					<View className='flex flex-col gap-1 bg-white p-4 rounded-sm border-2 border-[#E3E4E6]'>
						<Text className='text-red-700 font-semibold text-sm'>{`# ${order?.orderId}`}</Text>

						<View className='flex flex-row items-center justify-between gap-3'>
							<Text className='text-black text-sm'>{formatDateDaysMonthYear(order?.creationDate)}</Text>

							<OrderStatusBadge
								solid
								statusId={status}
								statusDescription={order?.statusDescription}
								className='shrink-0'
							/>
						</View>
					</View>

					{/* Endereço */}
					{address && (
						<View className='bg-white p-4 rounded-sm border-2 border-[#E3E4E6] flex flex-col'>
							<Text className='text-sm font-bold text-black uppercase tracking-wide mb-3'>
								{t('orderDetails.address.title', 'Endereço')}
							</Text>

							<View className='flex flex-col mb-[6px]'>
								<Text className='text-sm font-semibold text-black mb-[6px]'>{address.receiverName}</Text>

								<Text className='text-xs text-black font-semibold'>
									{t('orderDetails.address.label', 'Endereço')}
								</Text>
								<Text className='text-xs text-gray-700'>{address.formattedAddress}</Text>
							</View>

							<View className='flex flex-row justify-between gap-5'>
								<View className='flex flex-col gap-2'>
									<Text className='text-xs font-semibold text-black uppercase tracking-wide'>
										{t('orderDetails.address.neighborhood', 'Bairro')}
									</Text>
									<Text className='text-xs text-gray-700'>{address.neighborhood}</Text>
								</View>

								<View className='flex flex-col gap-2'>
									<Text className='text-xs font-semibold text-black uppercase tracking-wide'>
										{t('orderDetails.address.city', 'Cidade')}
									</Text>
									<Text className='text-xs text-gray-700'>{address.city}</Text>
								</View>

								<View className='flex flex-col gap-2'>
									<Text className='text-xs font-semibold text-black uppercase tracking-wide'>
										{t('orderDetails.address.country', 'País')}
									</Text>
									<Text className='text-xs text-gray-700'>{address.country}</Text>
								</View>

								<View className='flex flex-col gap-2'>
									<Text className='text-xs font-semibold text-black uppercase tracking-wide'>
										{t('orderDetails.address.postalCode', 'CEP')}
									</Text>
									<Text className='text-xs text-gray-700'>{address.postalCode}</Text>
								</View>
							</View>
						</View>
					)}

					{/* Forma de pagamento */}
					{payInfo && (
						<View className='bg-white p-4 rounded-sm border-2 border-[#E3E4E6] flex flex-col'>
							<Text className='text-sm font-bold text-black uppercase tracking-wide mb-3'>
								{t('orderDetails.payment.title', 'Forma de pagamento')}
							</Text>

							<View className='flex flex-col mb-[6px]'>
								<Text className='text-sm font-semibold text-black mb-[6px]'>{payInfo.name}</Text>

								{payInfo.cardLastDigits && (
									<Text className='text-xs text-gray-700'>
										{t('orderDetails.payment.finalDigits', 'final')} {payInfo.cardLastDigits}
									</Text>
								)}

								<Text className='text-xs text-gray-700'>
									{formatPriceInCents(payInfo.value)} ({payInfo.installments}x)
								</Text>
							</View>

							{hasPaymentAdditionalInfo && (
								<>
									<View
										className='flex flex-row items-center gap-1 mt-2'
										onClick={() => setShowPaymentDetails(!showPaymentDetails)}>
										<InfoCircleIcon />
										<Text className='text-xs text-gray-700'>
											{t('orderDetails.payment.additionalInfo', 'Informações adicionais')}
										</Text>
									</View>

									{showPaymentDetails && (
										<View className='flex flex-col gap-1 mt-1 pt-2 border-t border-gray-100'>
											{order?.authorizedDate && (
												<Text className='text-xs text-gray-500'>
													{t('orderDetails.payment.authorizedDate', 'Aprovado em')}:{' '}
													{formatDateDaysMonthYear(order.authorizedDate)}
												</Text>
											)}
											{payInfo.tid && (
												<Text className='text-xs text-gray-500'>
													{t('orderDetails.payment.transactionId', 'Nº da transação')}: {payInfo.tid}
												</Text>
											)}
										</View>
									)}
								</>
							)}
						</View>
					)}

					{/* Resumo */}
					<View className='bg-white p-4 rounded-sm border-2 border-[#E3E4E6] flex flex-col'>
						<Text className='text-sm font-bold text-black uppercase tracking-wide mb-3'>
							{t('orderDetails.summary.title', 'Resumo')}
						</Text>

						<View className='flex flex-row justify-between pb-[6px]'>
							<Text className='text-xs text-gray-700'>{t('orderDetails.summary.subtotal', 'Subtotal')}</Text>
							<Text className='text-xs text-gray-700'>{formatPriceInCents(getTotalByGroup('Items'))}</Text>
						</View>

						<View className='flex flex-row justify-between py-[6px] border-b border-t border-gray-300'>
							<Text className='text-xs text-gray-700'>{t('orderDetails.summary.shipping', 'Entrega')}</Text>
							<Text className='text-xs text-gray-700'>{formatPriceInCents(getTotalByGroup('Shipping'))}</Text>
						</View>

						<View className='flex flex-row justify-between pt-[6px]'>
							<Text className='text-sm font-semibold text-black'>{t('orderDetails.summary.total', 'Total')}</Text>
							<Text className='text-sm font-semibold text-black'>{formatPriceInCents(getTotalValue())}</Text>
						</View>
					</View>

					{/* Timeline / Status */}
					{!isCanceled && (
						<View className='bg-white p-4 rounded-sm border-2 border-[#E3E4E6]'>
							<View className='flex flex-row items-center w-full pb-8'>
								{steps.map((step, index) => {
									const isFirst = index === 0
									const isLast = index === steps.length - 1
									const labelPosition = isFirst
										? 'left-0 text-left'
										: isLast
											? 'right-0 text-right'
											: 'left-1/2 -translate-x-1/2 text-center'

									return (
										<View
											key={step.label}
											className={`flex flex-row items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
											<View className='relative flex items-center justify-center h-[14px] shrink-0'>
												{step.isCurrent ? (
													<StepCurrentIcon />
												) : step.done ? (
													<StepDoneIcon />
												) : (
													<View className='w-[10px] h-[10px] rounded-full bg-gray-300' />
												)}

												<Text
													className={`absolute top-full mt-[13px] w-[64px] text-[10px] text-gray-700 leading-tight ${labelPosition}`}>
													{step.label}
												</Text>
											</View>

											{index < steps.length - 1 && (
												<View
													className={`flex-1 h-[2px] mx-[6px] ${steps[index + 1].done ? 'bg-[#8BC34A]' : 'bg-gray-300'}`}
												/>
											)}
										</View>
									)
								})}
							</View>
						</View>
					)}

					{/* Items */}
					<View className='flex flex-col gap-3'>
						{itemsToShow.map(item => (
							<View
								key={item.uniqueId}
								className='bg-white px-3 py-4 flex flex-row gap-4 items-center rounded-sm border border-[#E3E4E6]'>
								<View className='bg-gray-100 p-2 h-[102px] w-[84px] flex items-center justify-center'>
									<ImageCard
										imageUrl={item.imageUrl}
										className='w-[80px] h-[80px] object-contain mix-blend-multiply'
									/>
								</View>

								<View className='flex flex-col flex-1 justify-center gap-1'>
									<Text className='text-xs text-black leading-tight'>{item.name}</Text>
									<Text className='text-xs text-gray-500'>{formatQuantity(item.quantity)}</Text>
									<Text className='text-xs text-gray-500'>{formatPriceInCents(item.price)}</Text>
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
				</View>

				<BottomInset />
			</Page>
		</ProtectedView>
	)
}
