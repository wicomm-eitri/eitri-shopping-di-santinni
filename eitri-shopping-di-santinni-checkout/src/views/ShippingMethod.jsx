import { useState, useEffect } from 'react'
import { useTranslation } from 'eitri-i18n'
import {
	BottomInset,
	CustomButton,
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	Steps,
	cartShippingResolver
} from 'eitri-shopping-di-santinni-shared'
import CardSelector from '../components/CardSelector/CardSelector'
import CartItemsContent from '../components/CartItemsContent/CartItemsContent'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { navigate } from '../services/navigationService'
import plusIcon from '../assets/icons/plusIcon.svg'

const STEP_DOT_CLASS = 'w-4 h-4 rounded-full'
const STEP_TEXT_CLASS = 'text-sm'

export default function ShippingMethod(props) {
	const { t } = useTranslation()
	const { cart, setFreight, setLogisticInfo } = useLocalShoppingCart()
	const [selectedAddress, setSelectedAddress] = useState(null)
	const [sessionAddresses, setSessionAddresses] = useState([])

	const [isLoading, setIsLoading] = useState(false)

	const shippingOptions = cartShippingResolver(cart)

	const goToFreightSelector = () => navigate('FreightSelector', {}, false)

	const goToAddressSelector = () => navigate('AddressSelector', {}, false)

	const onSelectFreightOption = async freightOption => {
		try {
			setIsLoading(true)

			const slas = freightOption.slas.map(sla => ({
				itemIndex: sla.itemIndex,
				selectedSla: sla.id,
				selectedDeliveryChannel: sla.isPickupInPoint ? 'pickup-in-point' : 'delivery'
			}))

			const payload = {
				clearAddressIfPostalCodeNotFound: false,
				logisticsInfo: slas,
				selectedAddresses: cart.shippingData.selectedAddresses
			}

			await setFreight(payload)

			navigate('PaymentData')
		} catch (error) {
			console.error('Error on select freight option', error)
		} finally {
			setIsLoading(false)
		}
	}

	const pickUpOptions = shippingOptions?.options?.filter(opt => opt.isPickupInPoint)
	const deliveryOptions = shippingOptions?.options?.filter(opt => !opt.isPickupInPoint)

	const currentOrFirstPickUpOption = pickUpOptions?.find(p => p.isCurrent) || pickUpOptions?.[0]

	useEffect(() => {
		try {
			const stored = JSON.parse(localStorage.getItem('session_addresses') || '[]')
			setSessionAddresses(Array.isArray(stored) ? stored : [])
		} catch (e) {
			setSessionAddresses([])
		}
	}, [cart])

	const addressesToShow = (() => {
		const list = []

		for (let i = 0; i < sessionAddresses.length; i++) {
			const a = sessionAddresses[i]
			list.push({
				...a,
				_source: 'session',
				_id: `session-${i}`
			})
		}

		if (shippingOptions?.address) {
			const sa = shippingOptions.address

			const dup = list.find(
				x => x.postalCode === sa.postalCode && x.street === sa.street && x.number === sa.number
			)

			if (!dup) {
				list.push({
					...sa,
					_source: 'server',
					_id: sa.addressId || 'server-0'
				})
			}
		}

		return list.slice(0, 2)
	})()

	const handleSelectAddressFactory = addr => async () => {
		try {
			setIsLoading(true)
			setSelectedAddress(addr._id || addr.addressId || `${addr.postalCode}-${addr.number}`)

			const normalized = {
				...addr,
				geoCoordinates: Array.isArray(addr.geoCoordinates) ? addr.geoCoordinates.map(c => c) : []
			}

			const payload = {
				logisticsInfo: cart?.shippingData?.logisticsInfo,
				clearAddressIfPostalCodeNotFound: false,
				selectedAddresses: [normalized]
			}

			await setLogisticInfo(payload)
		} catch (err) {
			console.error('Error selecting address', err)
		} finally {
			setIsLoading(false)
		}
	}

	const handleRemoveAddress = addr => {
		if (addr._source !== 'session') return

		setSessionAddresses(prev => {
			const index = Number(addr._id.split('-')[1])
			const updatedAddresses = prev.filter((_, i) => i !== index)

			localStorage.setItem('session_addresses', JSON.stringify(updatedAddresses))
			return updatedAddresses
		})
	}

	return (
		<Page
			title='Checkout - Seleção de Endereço'
			className='bg-white'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={'Checkout'} />
			</HeaderContentWrapper>

			<Steps current={0} />

			<LoadingComponent
				fullScreen
				isLoading={isLoading}
			/>

			<View className='flex flex-col overflow-auto max-h-[70vh] px-2.5'>
				<CartItemsContent />

				<View className='flex flex-col gap-5 pb-[14px]'>
					<View className='flex flex-col gap-2'>
						<Text className='block text-sm font-semibold  text-black'>
							{t('shippingMethod.title') || 'MEUS ENDEREÇOS'}
						</Text>
					</View>

					{addressesToShow.map((addr, idx) => {
						const id = addr._id || addr.addressId || `${addr.postalCode}-${addr.number}`
						const display = `${addr.street || ''}${addr.number ? ', ' + addr.number : ''} - ${addr.neighborhood || ''}`

						return (
							<CardSelector
								key={id}
								mainTitle={addr.receiverName || 'Endereço de entrega'}
								selectable={true}
								checked={selectedAddress === id}
								onSelect={handleSelectAddressFactory(addr)}
								onRemove={() => handleRemoveAddress(addr)}
								secondaryActionHandler={goToAddressSelector}
								secondaryActionTitle={
									addr._source === 'session' ? 'Editar' : 'Trocar endereço de entrega'
								}>
								<View className='mb-2'>
									<Text className='text-gray-500 text-xs '>{display}</Text>
								</View>

								<Text className='text-gray-500 text-xs '>{`${addr.city || ''} - ${addr.state || ''}`}</Text>
							</CardSelector>
						)
					})}

					<View
						className='flex items-center gap-2 mt-4'
						onClick={() => navigate('AddressForm', {}, true)}>
						<Image
							src={plusIcon}
							alt='Ícone de adição'
						/>

						<Text className='text-red-700 text-xs'>
							{t('addressSelector.addNewAddress', 'Adicionar Novo Endereço')}
						</Text>
					</View>

					{currentOrFirstPickUpOption && (
						<CardSelector
							mainTitle={currentOrFirstPickUpOption.label}
							mainClickHandler={() => onSelectFreightOption(currentOrFirstPickUpOption)}
							secondaryActionHandler={() => navigate('PickupSelector')}
							secondaryActionTitle={'Retirar em outra loja'}>
							<Text className='text-red-700 text-sm'>{`${currentOrFirstPickUpOption.address.street}, ${currentOrFirstPickUpOption.address.number} ${currentOrFirstPickUpOption.address.complement}`}</Text>

							<Text className='text-red-700 text-xs'>{`${currentOrFirstPickUpOption.address.neighborhood} - ${currentOrFirstPickUpOption.address.city} - ${currentOrFirstPickUpOption.address.state}`}</Text>

							<Text className='text-red-700 text-xs'>{`CEP: ${currentOrFirstPickUpOption.address.postalCode}`}</Text>
						</CardSelector>
					)}
				</View>
			</View>

			<View className='fixed bottom-0 left-0 w-full z-10 bg-white border-t border-gray-300'>
				<View className='p-4'>
					<CustomButton
						disabled={
							!shippingOptions?.options || shippingOptions?.options?.length === 0 || !selectedAddress
						}
						label={'CONTINUAR PARA COMPRA'}
						onPress={() => {
							if (!selectedAddress) return
							goToFreightSelector()
						}}
					/>
				</View>

				<BottomInset />
			</View>
		</Page>
	)
}
