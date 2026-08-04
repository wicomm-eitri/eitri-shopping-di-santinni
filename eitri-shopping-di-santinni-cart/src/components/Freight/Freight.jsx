import { useEffect, useState } from 'react'
import { useTranslation } from 'eitri-i18n'
import { CustomButton, CustomInput, cartShippingResolver } from 'eitri-shopping-di-santinni-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { loadPostalCodeFromStorage, savePostalCodeOnStorage } from '../../services/customerService'

export default function Freight(props) {
	const { cart, setNewAddress, setFreight } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [zipCode, setZipCode] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(false)
	const [isEditingZipCode, setIsEditingZipCode] = useState(false)

	useEffect(() => {
		if (cart) {
			if (!cart?.shippingData?.address) {
				loadPostalCodeFromStorage().then(postalCode => {
					if (postalCode) {
						setZipCode(postalCode)
						fetchFreight(postalCode)
					}
				})
			} else {
				setZipCode(cart?.shippingData?.address?.postalCode)
				fetchFreight(cart?.shippingData?.address?.postalCode)
			}
		}
	}, [])

	const onInputZipCode = e => setZipCode(e.target.value)

	const formatZipCode = zipCode => zipCode?.replace(/^(\d{5})-?(\d{3}).*$/, '$1-$2')

	const onPressZipCodeChange = async () => {
		try {
			if (!zipCode) return

			if (!(zipCode.length == 8 || zipCode.length == 9)) {
				setError(t('freight.errorCep', 'Digite um CEP válido'))

				return
			}

			setError(false)
			fetchFreight(zipCode)
		} catch (e) {
			console.error('Error onPressZipCodeChange', e)
		}
	}

	const onPressEditZipCode = () => {
		setIsEditingZipCode(true)
		setZipCode('')
		setError('')
	}

	const fetchFreight = async zipCode => {
		setIsLoading(true)

		try {
			setError('')

			savePostalCodeOnStorage(zipCode)

			await setNewAddress(cart, zipCode)

			setIsEditingZipCode(false)
		} catch (error) {
			console.error('Error fetching freight', error)
			setError(t('freight.errorCalcFreight', 'Não foi possível calcular o frete'))
		} finally {
			setIsLoading(false)
		}
	}

	const handleOptionSelect = async option => {
		try {
			setIsLoading(true)

			const payload = {
				clearAddressIfPostalCodeNotFound: true,
				logisticsInfo: option?.slas?.map(sla => {
					return {
						itemIndex: sla.itemIndex,
						selectedDeliveryChannel: sla.deliveryChannel,
						selectedSla: sla.id
					}
				}),
				selectedAddresses: cart?.shippingData?.selectedAddresses
			}

			await setFreight(payload)
		} catch (e) {
			console.error('Error handleOptionSelect', e)
			setError(t('freight.errorEditFreight', 'Não foi possível modificar o frete'))
		} finally {
			setIsLoading(false)
		}
	}

	if (!cart) return null

	const shipping = cartShippingResolver(cart)
	const deliveryOptions = shipping?.options?.filter(option => !option.isPickupInPoint) || []
	const pickupOptions = shipping?.options?.filter(option => option.isPickupInPoint) || []

	const renderOption = (item, index) => (
		<View
			key={item?.slas?.map(sla => sla.id).join('-') || item?.label || index}
			className='flex items-center w-full'>
			<View className='flex items-center w-full gap-2'>
				<Radio
					className='!w-4 !h-4 checked:!bg-red-700 !border-gray-400'
					checked={item.isCurrent}
					name='freight-option'
					value={item?.label}
					onChange={() => handleOptionSelect(item)}
				/>

				<View className='w-full flex flex-col flex-1'>
					<Text className='text-xs font-semibold'>{item?.label}</Text>

					<Text className='text-xs text-gray-500'>{item?.shippingEstimate}</Text>

					{item.isPickupInPoint && <Text className='text-xs text-gray-500'>{item?.formatedPickAddress}</Text>}
				</View>

				<Text className='text-sm text-red-700 font-semibold'>{item?.price}</Text>
			</View>
		</View>
	)

	return (
		<View className='px-4'>
			{isEditingZipCode || !zipCode ? (
				<View className='flex justify-between mt-2 items-center w-full'>
					<View className='w-2/3'>
						<CustomInput
							placeholder={t('freight.labelZipCode', 'CEP')}
							value={zipCode}
							variant='mask'
							mask='99999-999'
							inputMode='numeric'
							className='!border-x-0 !border-t-0 !rounded-none !border-gray-300 !h-10 !text-xs text-gray-500 !pl-2'
							onChange={onInputZipCode}
						/>
					</View>

					<View className='w-1/3'>
						<CustomButton
							variant='outlined'
							isLoading={isLoading}
							label={t('freight.txtCalculate', 'CALCULAR')}
							className='!border-x-0 !border-t-0 !rounded-none !border-gray-300 !h-10'
							textClassName='!text-xs !font-normal !text-xs'
							onPress={onPressZipCodeChange}
						/>
					</View>
				</View>
			) : (
				<View className='mt-2 flex items-center justify-between gap-4'>
					<Text className='text-sm font-medium'>
						{`${t('freight.receiveAt', 'Receber em')} ${formatZipCode(zipCode)}`}
					</Text>

					<View onClick={onPressEditZipCode}>
						<Text className='text-sm font-semibold underline'>{t('freight.change', 'Alterar')}</Text>
					</View>
				</View>
			)}

			{!zipCode && (
				<View
					className='flex items-center gap-1 w-fit mt-2'
					onClick={() =>
						Eitri.openBrowser({
							url: 'https://buscacepinter.correios.com.br/app/endereco/index.php',
							inApp: true
						})
					}>
					<Text className='text-gray-700 text-xs underline'>Não sei meu CEP</Text>

					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='12'
						height='12'
						viewBox='0 0 12 12'
						fill='none'>
						<path
							d='M11.2496 0H5.99961V1.5H9.44961L4.72461 6.225L5.77461 7.275L10.4996 2.55V6H11.9996V0.75C11.9996 0.3 11.6996 0 11.2496 0Z'
							fill='#555'
						/>
						<path
							d='M10.5 12H0.75C0.3 12 0 11.7 0 11.25V1.5C0 1.05 0.3 0.75 0.75 0.75H3.75V2.25H1.5V10.5H9.75V8.25H11.25V11.25C11.25 11.7 10.95 12 10.5 12Z'
							fill='#555'
						/>
					</svg>
				</View>
			)}

			{shipping?.address && !shipping?.shippingAvailable && (
				<View className='mt-2 p-2 bg-red-50 border border-red-200 rounded'>
					<Text className='text-sm text-red-600 font-medium'>
						{t('freight.unavailableDelivery', 'Entrega indisponível')}
					</Text>
				</View>
			)}

			{isLoading && <View className={`mt-4 w-full h-[120px] bg-gray-200 rounded animate-pulse`} />}

			{!isLoading && shipping && shipping?.options.length > 0 && (
				<>
					{deliveryOptions.length > 0 && (
						<View className='flex flex-col mt-4'>
							<Text className='text-sm font-semibold'>
								{t('freight.tabDelivery', 'Opções de Entrega')}
							</Text>

							<View className='flex flex-col p-3 mt-2 border border-gray-300 rounded items-center justify-between gap-3'>
								{deliveryOptions.map(renderOption)}
							</View>
						</View>
					)}

					{pickupOptions.length > 0 && (
						<View className='flex flex-col mt-4'>
							<Text className='text-sm font-semibold'>
								{t('freight.tabPickup', 'Opções de Retirada')}
							</Text>

							<View className='flex flex-col p-3 mt-2 border border-gray-300 rounded items-center justify-between gap-3'>
								{pickupOptions.map(renderOption)}
							</View>
						</View>
					)}
				</>
			)}

			{error && (
				<View className='mt-1'>
					<Text className='text-sm text-red-600 font-medium'>{error}</Text>
				</View>
			)}
		</View>
	)
}
