import { useState, useEffect } from 'react'
import { useTranslation } from 'eitri-i18n'
import { CustomButton } from 'eitri-shopping-di-santinni-shared'
import { getOrderById } from '../../services/CustomerService'
import { navigate, PAGES } from '../../services/NavigationService'
import { formatPriceInCents } from '../../utils/utils'
import ImageCard from '../Image/ImageCard'

export default function OrderCard(props) {
	const { order } = props
	const { t } = useTranslation()

	const [loadingDetails, setLoadingDetails] = useState(false)
	const [orderDetail, setOrderDetails] = useState(null)

	useEffect(() => {
		loadDetails()
	}, [order])

	const loadDetails = async () => {
		setLoadingDetails(true)

		try {
			const result = await getOrderById(order?.orderId)

			setOrderDetails(result)
		} catch (e) {
			console.error(t('orderCard.loadDetailsError', 'Falha ao carregar detalhes do pedido:'), e)
		} finally {
			setLoadingDetails(false)
		}
	}

	const openOrderDetails = () => {
		if (orderDetail) {
			navigate(PAGES.ORDER_DETAILS, { order: orderDetail })
		} else {
			navigate(PAGES.ORDER_DETAILS, { order: order.orderId })
		}
	}

	const formatDateTime = dateString => {
		if (!dateString) return ''

		const d = new Date(dateString)
		const day = String(d.getDate()).padStart(2, '0')
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const year = d.getFullYear()
		const hours = String(d.getHours()).padStart(2, '0')
		const minutes = String(d.getMinutes()).padStart(2, '0')

		return `${day}/${month}/${year} às ${hours}:${minutes}`
	}

	const firstItemImage = orderDetail?.items?.[0]?.imageUrl

	// ... (imports e lógica do componente mantidos)

	// ... (imports e lógica do componente mantidos)

	return (
		<View className='flex flex-col bg-white rounded shadow-sm border border-gray-100 w-full p-4'>
			<View className='flex flex-row items-center gap-4 mb-4'>
				{/* Removido o 'rounded' para deixar quadrado como na imagem */}
				<View className='w-24 h-24 bg-gray-50 flex items-center justify-center shrink-0'>
					{loadingDetails ? (
						<View className='w-full h-full bg-gray-100 animate-pulse' />
					) : firstItemImage ? (
						<ImageCard
							imageUrl={firstItemImage}
							className='w-full h-full object-contain mix-blend-multiply p-1'
						/>
					) : (
						<View className='w-full h-full bg-gray-50' />
					)}
				</View>
				<View className='flex flex-col flex-1 gap-2 justify-center'>
					<Text className='text-sm font-semibold text-red-700'>
						{t('orderCard.orderLabel', 'Nº do pedido:')} {order?.orderId}
					</Text>
					<Text className='text-xs text-gray-500 mt-2'>
						{t('orderCard.realizedAt', 'Realizado em:')} {formatDateTime(order?.creationDate)}
					</Text>
					<Text className='text-xs text-gray-500 mt-1'>
						{t('orderCard.value', 'Valor:')} {formatPriceInCents(order?.totalValue)}
					</Text>
				</View>
			</View>

			<CustomButton
				width='100%'
				variant='outlined'
				className='!border-red-700 !rounded-full !h-[36px]'
				textClassName='!text-red-700 font-bold text-xs uppercase tracking-wide'
				label={t('orderCard.viewOrderDetails', 'Ver detalhes')}
				onPress={openOrderDetails}
			/>
		</View>
	)
}
