import { useEffect, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { Page, View, Text, Image } from 'eitri-luminus'
import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset } from 'eitri-shopping-di-santinni-shared'
import { navigate } from '@/services/navigationService'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { trackScreenView } from '../services/Tracking'
import { clearCart, getPixStatus } from '../services/cartService'
import { formatAmountInCents } from '../utils/utils'

export default function PixOrder(props) {
	const { t } = useTranslation()
	const [timeOut, setTimeOut] = useState(10 * 60)
	const [pixPayload, setPixPayload] = useState(null)

	let isMounted = true

	const { cart } = useLocalShoppingCart()

	useEffect(() => {
		trackScreenView(`checkout_pix`, 'checkout.pixOrder')
	}, [])

	useEffect(() => {
		const result = props.location?.state?.paymentResult

		if (result) {
			const appPayload = parseResponse(result?.paymentAuthorizationAppCollection?.[0].appPayload)

			setPixPayload(appPayload)

			checkPixStatus(appPayload.transactionId, appPayload.paymentId)

			const interval = setInterval(() => {
				setTimeOut(prev => prev - 1)
			}, 1000)

			return () => {
				isMounted = false
				clearInterval(interval)
			}
		}
	}, [props.location?.state?.paymentResult])

	useEffect(() => {
		if (timeOut <= 0) {
			Eitri.navigation.back()
		}
	}, [timeOut])

	function parseResponse(str) {
		try {
			return JSON.parse(str)
		} catch (e) {
			const codeMatch = str.match(/code:([^,}]*)/)
			const qrCodeMatch = str.match(/qrCodeBase64Image:([^,}]*)/)
			const paymentId = str.match(/paymentId:([^,}]*)/)
			const transactionId = str.match(/transactionId:([^,}]*)/)

			return {
				code: codeMatch ? codeMatch[1] : null,
				qrCodeBase64Image: qrCodeMatch ? qrCodeMatch[1] : null,
				paymentId,
				transactionId
			}
		}
	}

	const copyCode = async () => {
		Eitri.clipboard.setText({
			text: pixPayload.code
		})
	}

	async function checkPixStatus(transactionId, paymentId) {
		try {
			if (!isMounted) return

			const result = await getPixStatus(transactionId, paymentId)

			if (!result) return

			if (result.status === 'waiting') {
				await new Promise(resolve => setTimeout(resolve, 10000))
				await checkPixStatus(transactionId, paymentId)
			} else {
				clearCart()
				navigate('OrderCompleted', { orderId: result?.orderId })
			}
		} catch (error) {
			console.error('Erro ao verificar status do PIX [checkPixStatus]:', error)
		}
	}

	if (!pixPayload) return null

	const expiryDate = new Date()

	expiryDate.setMinutes(expiryDate.getMinutes() + 10)
	const format2Digits = n => n.toString().padStart(2, '0')
	const expiryFormatted = `${format2Digits(expiryDate.getDate())}/${format2Digits(
		expiryDate.getMonth() + 1
	)}/${expiryDate.getFullYear()} ${format2Digits(expiryDate.getHours())}:${format2Digits(
		expiryDate.getMinutes()
	)}:${format2Digits(expiryDate.getSeconds())}`

	const orderDateFormatted = `${format2Digits(new Date().getDate())}/${format2Digits(
		new Date().getMonth() + 1
	)}/${new Date().getFullYear()}`

	const customerName = cart?.clientProfileData?.firstName
		? `${cart.clientProfileData.firstName} ${cart.clientProfileData.lastName}`
		: ''

	const getSubtotal = () => cart?.totalizers?.find(t => t.id === 'Items')?.value || 0
	const getDiscount = () => cart?.totalizers?.find(t => t.id === 'Discounts')?.value || 0
	const getShipping = () => cart?.totalizers?.find(t => t.id === 'Shipping')?.value || 0

	return (
		<Page>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={'Checkout'} />
			</HeaderContentWrapper>

			<View className='p-4 flex flex-col bg-white min-h-screen'>
				{/* Header PIX */}
				<View className='flex flex-col items-center justify-center pt-2'>
					<Text className='text-red-700 font-bold text-sm uppercase mb-2'>
						{t('pixOrder.title', 'PAGAMENTO POR PIX')}
					</Text>

					{/* QR Code */}
					<Image
						src={`data:image;base64,${pixPayload.qrCodeBase64Image}`}
						className='w-[160px] h-[160px] mb-4'
					/>

					{/* Input do código PIX */}
					<View className='w-full border border-gray-300 p-2 mb-2'>
						<Text className='text-xs text-center text-gray-400 truncate w-full'>{pixPayload.code}</Text>
					</View>

					{/* Botão Copiar */}
					<View onClick={copyCode}>
						<Text className='text-red-700 text-xs underline  py-1'>
							{t('pixOrder.copyCode', 'COPIAR CÓDIGO')}
						</Text>
					</View>

					{/* Validade */}
					<View className='mt-3 flex flex-col items-center gap-1 mb-8'>
						<Text className='text-xs font-bold text-gray-800'>
							{t('pixOrder.validUntil', 'QR Code válido até:')} {expiryFormatted}
						</Text>
						<Text className='text-xs font-bold text-gray-800'>
							{t('pixOrder.brasiliaTime', '(Horário de Brasília)')}
						</Text>
					</View>
				</View>

				{/* Informações do pedido */}
				<View className='flex flex-col gap-2 mb-8'>
					<Text className='font-bold text-xs text-gray-900 mb-1'>
						{t('pixOrder.orderInfo', 'Informações do pedido')}
					</Text>

					<Text className='text-xs text-gray-700'>
						Status:{' '}
						<Text className='text-red-700 font-bold text-xs'>
							{t('pixOrder.waitingPayment', 'Esperando pagamento')}
						</Text>
					</Text>

					<Text className='text-xs text-gray-700'>
						Valor total:{' '}
						<Text className='font-bold text-gray-900 text-xs'>{formatAmountInCents(cart?.value || 0)}</Text>
					</Text>

					<Text className='text-xs text-gray-700'>
						Data do pedido: <Text className='font-bold text-gray-900 text-xs'>{orderDateFormatted}</Text>
					</Text>

					<Text className='text-xs text-gray-700'>
						Comprado por: <Text className='font-bold text-gray-900 text-xs'>{customerName}</Text>
					</Text>

					<Text className='text-xs text-gray-700'>
						Forma de pagamento: <Text className='font-bold text-gray-900 text-xs'>Pix</Text>
					</Text>

					<Text className='text-xs text-gray-600 mt-2 leading-tight pr-4'>
						{t(
							'pixOrder.trackOrder',
							'Você pode acompanhar o status do seu pedido em Minha Conta > Meus Pedidos'
						)}
					</Text>

					<View
						className='flex items-center justify-center mt-2'
						onClick={() => navigate('Profile')}>
						<Text className='text-red-700 text-xs  font-bold uppercase'>
							{t('pixOrder.viewOrders', 'VER MEUS PEDIDOS')}
						</Text>
					</View>
				</View>

				{/* Resumo do pedido */}
				<View className='flex flex-col mt-2 pb-10'>
					<Text className='font-bold text-xs text-gray-900 mb-4'>
						{t('pixOrder.orderSummary', 'Resumo do pedido')}
					</Text>

					{/* Itens */}
					<View className='flex flex-col gap-4 mb-6'>
						{cart?.items?.map(item => (
							<View
								key={item.uniqueId}
								className='flex flex-row gap-3'>
								<View className='w-16 h-16 rounded-md overflow-hidden'>
									<Image
										src={item.imageUrl}
										className='w-full h-full object-contain'
									/>
								</View>
								<View className='flex flex-col flex-1 justify-center gap-1'>
									<Text className='text-xs font-bold text-gray-900 leading-tight'>{item.name}</Text>
									<Text className='text-[9px] text-gray-600'>{item.id}</Text>
									<Text className='text-red-700 font-bold text-xs mt-1'>
										{formatAmountInCents(item.price)}
									</Text>
								</View>
							</View>
						))}
					</View>

					{/* Totais */}
					<View className='flex flex-col gap-2'>
						<View className='flex justify-between'>
							<Text className='text-xs text-gray-600'>{t('pixOrder.subtotal', 'Subtotal')}</Text>
							<Text className='text-xs text-gray-600'>{formatAmountInCents(getSubtotal())}</Text>
						</View>
						<View className='flex justify-between'>
							<Text className='text-xs text-gray-600'>{t('pixOrder.discount', 'Desconto')}</Text>
							<Text className='text-xs text-gray-600'>
								{getDiscount() < 0
									? `- ${formatAmountInCents(Math.abs(getDiscount()))}`
									: formatAmountInCents(0)}
							</Text>
						</View>
						<View className='flex justify-between'>
							<Text className='text-xs text-gray-600'>{t('pixOrder.shipping', 'Frete')}</Text>
							<Text className='text-xs text-gray-600'>
								{getShipping() === 0 ? 'Grátis' : formatAmountInCents(getShipping())}
							</Text>
						</View>
						<View className='flex justify-between mt-1'>
							<Text className='text-[11px] font-bold text-gray-900'>{t('pixOrder.total', 'Total')}</Text>
							<Text className='text-[11px] font-bold text-gray-900'>
								{formatAmountInCents(cart?.value || 0)}
							</Text>
						</View>
					</View>
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
