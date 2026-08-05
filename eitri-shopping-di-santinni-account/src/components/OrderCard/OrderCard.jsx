import { useState, useEffect } from 'react'
import { useTranslation } from 'eitri-i18n'
import { CustomButton } from 'eitri-shopping-di-santinni-shared'
import { getOrderById } from '../../services/CustomerService'
import { navigate, PAGES } from '../../services/NavigationService'
import { formatPriceInCents } from '../../utils/utils'
import ImageCard from '../Image/ImageCard'
import OrderStatusBadge from '../OrderStatusBadge/OrderStatusBadge'

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
			navigate(PAGES.ORDER_DETAILS, { orderId: order.orderId })
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

	const formatQuantity = quantity => {
		const qty = quantity || 1

		return `${qty} ${qty === 1 ? t('orderCard.unit', 'unidade') : t('orderCard.units', 'unidades')}`
	}

	const firstItem = orderDetail?.items?.[0]

	return (
		<View className='flex flex-col bg-white rounded-sm shadow-sm border border-[#E3E4E6] w-full overflow-hidden'>
			<View className='flex flex-col gap-[6px] bg-[#F9F9F9] p-3'>
				<Text className='text-sm font-semibold text-red-700'>{`# ${order?.orderId}`}</Text>

				<View className='flex flex-row items-center justify-between gap-3'>
					<View className='flex flex-row gap-8'>
						<View className='flex flex-col gap-1'>
							<Text className='text-xs font-normal text-gray-500 uppercase tracking-wide'>
								{t('orderCard.orderDateLabel', 'Data do pedido')}
							</Text>
							<Text className='text-xs font-semibold text-gray-500'>{formatDateTime(order?.creationDate)}</Text>
						</View>

						<View className='flex flex-col gap-1'>
							<Text className='text-xs font-normal text-gray-500 uppercase tracking-wide'>
								{t('orderCard.totalLabel', 'Total')}
							</Text>
							<Text className='text-xs font-semibold text-gray-500'>
								{formatPriceInCents(order?.totalValue)}
							</Text>
						</View>
					</View>

					<OrderStatusBadge
						solid
						statusId={order?.status}
						statusDescription={order?.statusDescription}
						className='shrink-0'
					/>
				</View>
			</View>

			<View className='flex flex-row items-center gap-4 p-4'>
				<View className='w-20 h-20 bg-gray-50 flex items-center justify-center shrink-0'>
					{loadingDetails ? (
						<View className='w-full h-full bg-gray-100 animate-pulse' />
					) : firstItem?.imageUrl ? (
						<ImageCard
							imageUrl={firstItem.imageUrl}
							className='w-full h-full object-contain mix-blend-multiply p-1'
						/>
					) : (
						<View className='w-full h-full bg-gray-50' />
					)}
				</View>
				<View className='flex flex-col flex-1 gap-1 justify-center'>
					<Text className='text-sm text-gray-800'>{firstItem?.name}</Text>
					<Text className='text-xs text-gray-500'>{formatQuantity(firstItem?.quantity ?? order?.totalItems)}</Text>
					<Text className='text-xs text-gray-500'>{formatPriceInCents(firstItem?.price)}</Text>
				</View>
			</View>

			<View className='px-4 pb-4'>
				<CustomButton
					width='100%'
					variant='outlined'
					className='!border-red-700 !rounded-full !h-[36px]'
					textClassName='!text-red-700 font-bold text-xs uppercase tracking-wide'
					label={t('orderCard.viewOrderDetails', 'Ver detalhes')}
					onPress={openOrderDetails}
				/>
			</View>
		</View>
	)
}
