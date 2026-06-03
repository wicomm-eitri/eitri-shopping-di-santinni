import { useTranslation } from 'eitri-i18n'
import { shippingResolver, cartShippingResolver } from 'eitri-shopping-di-santinni-shared'
import iconStore from '../../assets/images/store.svg'
import iconTruck from '../../assets/images/truck.svg'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { navigate } from '../../services/navigationService'
import SimpleCard from '../Card/SimpleCard'

export default function DeliveryData(props) {
	const { cart } = useLocalShoppingCart()
	const { t } = useTranslation()

	const shipping = shippingResolver(cart)
	const shippingOptions = cartShippingResolver(cart)
	const currentOption = shippingOptions?.options?.find(opt => opt.isCurrent)

	const getServiceTitle = item => {
		if (!item) return ''
		const label = (item?.label || '').toLowerCase()
		const slas = Array.isArray(item?.slas) ? item.slas : []

		if (
			slas.some(
				sla =>
					(sla.courierId || '').toString().toLowerCase().includes('sedex') ||
					(sla.courierName || '').toString().toLowerCase().includes('sedex') ||
					sla.isFaster
			)
		) {
			return 'Sedex'
		}

		if (slas.some(sla => sla.isCheaper)) return 'Econômica'

		if (label.includes('sedex') || label.includes('expresso') || label.includes('express')) return 'Sedex'

		if (
			label.includes('econ') ||
			label.includes('econôm') ||
			label.includes('econômica') ||
			label.includes('econonica')
		) {
			return 'Econômica'
		}

		if (item?.shippingEstimate && /hora|h|dia|dias|dias úteis|úteis/i.test(item.shippingEstimate)) {
			return /hora|h/i.test(item.shippingEstimate) ? 'Sedex' : 'Econômica'
		}

		return item?.label || 'Econômica'
	}

	const displayLabel = currentOption ? getServiceTitle(currentOption) : null

	const onPressMainAction = async () => {
		navigate('ShippingMethods')
	}

	return (
		<View className={'flex flex-col gap-4'}>
			{shipping?.current?.map(currentDelivery => (
				<SimpleCard
					key={currentDelivery.id}
					isFilled={true}
					title={
						currentDelivery?.isPickupInPoint
							? t('deliveryData.txtWithdrawal', 'RETIRADA')
							: t('deliveryData.txtDelivery', 'ENTREGA')
					}
					icon={currentDelivery?.isPickupInPoint ? iconStore : iconTruck}
					onPress={onPressMainAction}>
					<View className='flex '>
						{currentDelivery?.isPickupInPoint ? (
							<View className='flex flex-col w-full'>
								<Text className='text-xs text-gray-500 mb-1'>
									{displayLabel || currentDelivery?.name}
								</Text>

								{currentDelivery.formattedShippingEstimate && (
									<Text className='text-xs text-gray-500 mb-1'>
										{currentDelivery.formattedShippingEstimate}
									</Text>
								)}

								<Text
									className={`text-xs ${
										currentDelivery.formatedPrice === 'Grátis'
											? 'text-green-600 font-medium'
											: 'text-gray-500'
									}`}>
									{currentDelivery.formatedPrice}
								</Text>
							</View>
						) : (
							<View className='flex flex-col w-full'>
								<Text className='text-xs text-gray-500 mb-1'>
									{displayLabel || currentDelivery?.name}
								</Text>

								{currentDelivery.formattedShippingEstimate && (
									<Text className='text-xs text-gray-500 mb-1'>
										{currentDelivery.formattedShippingEstimate}
									</Text>
								)}

								<Text
									className={`text-xs ${
										currentDelivery.formatedPrice === 'Grátis'
											? 'text-green-600 font-medium'
											: 'text-gray-500'
									}`}>
									{currentDelivery.formatedPrice}
								</Text>
							</View>
						)}
					</View>
				</SimpleCard>
			))}
		</View>
	)
}
