import { useTranslation } from 'eitri-i18n'
import { shippingResolver } from 'eitri-shopping-di-santinni-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { navigate } from '../../services/navigationService'
import SimpleCard from '../Card/SimpleCard'

export default function AddressData(props) {
	const { cart } = useLocalShoppingCart()
	const { t } = useTranslation()

	const shipping = shippingResolver(cart)

	const onPressMainAction = async () => {
		navigate('ShippingMethods')
	}

	return (
		<View className={'flex flex-col gap-4'}>
			{shipping?.current?.map(currentDelivery => (
				<SimpleCard
					key={`address-${currentDelivery.id}`}
					isFilled={true}
					title={t('addressData.txtAddress', 'ENDEREÇO')}
					onPress={onPressMainAction}>
					<View className='flex flex-col gap-1'>
						{currentDelivery?.isPickupInPoint ? (
							<>
								<Text className='text-xs font-medium text-neutral-600 mb-1'>
									{currentDelivery?.pickupStoreInfo?.address?.street},{' '}
									{currentDelivery?.pickupStoreInfo?.address?.number}
									{currentDelivery?.pickupStoreInfo?.address?.complement
										? ` - ${currentDelivery?.pickupStoreInfo?.address?.complement}`
										: ''}{' '}
									- {currentDelivery?.pickupStoreInfo?.address?.neighborhood}
								</Text>
								<Text className='text-xs text-neutral-600 mb-1'>
									{currentDelivery?.pickupStoreInfo?.address?.city} -{' '}
									{currentDelivery?.pickupStoreInfo?.address?.state}
								</Text>
								<Text className='text-xs text-neutral-600'>
									{currentDelivery?.pickupStoreInfo?.address?.postalCode}
								</Text>
							</>
						) : (
							<>
								<Text className='text-xs font-medium text-neutral-600 mb-1'>
									{currentDelivery?.address?.street},{' '}
									{currentDelivery?.address?.number === null
										? t('deliveryData.txtNoNumber', 'sem número')
										: currentDelivery?.address?.number}
									{currentDelivery?.address?.complement
										? ` - ${currentDelivery?.address?.complement}`
										: ''}{' '}
									- {currentDelivery?.address?.neighborhood}
								</Text>
								<Text className='text-xs text-neutral-600 mb-1'>
									{currentDelivery?.address?.city} - {currentDelivery?.address?.state}
								</Text>
								<Text className='text-xs text-neutral-600'>
									{currentDelivery?.address?.postalCode}
								</Text>
							</>
						)}
					</View>
				</SimpleCard>
			))}
		</View>
	)
}
