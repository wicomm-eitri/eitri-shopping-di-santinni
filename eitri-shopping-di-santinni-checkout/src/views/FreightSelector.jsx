import { useState } from 'react'
import { useTranslation } from 'eitri-i18n'
import {
	BottomInset,
	cartShippingResolver,
	CustomButton,
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	Steps
} from 'eitri-shopping-di-santinni-shared'
import CardSelector from '../components/CardSelector/CardSelector'
import CartItemsContent from '../components/CartItemsContent/CartItemsContent'
import FixedBottom from '../components/FixedBottom/FixedBottom'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { navigate } from '../services/navigationService'

export default function FreightSelector(props) {
	const { cart, setFreight } = useLocalShoppingCart()
	const [isLoading, setIsLoading] = useState(false)
	const { t } = useTranslation()

	const submit = async () => navigate('PaymentData', {}, true)

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
		} catch (error) {
			console.error('Error on select freight option', error)
		} finally {
			setIsLoading(false)
		}
	}

	const shippingOptions = cartShippingResolver(cart)
	const deliveryOptions = (shippingOptions?.options || []).filter(opt => !opt.isPickupInPoint)

	const getServiceTitle = item => {
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

	const parseDateFromString = str => {
		if (!str) return null

		if (str instanceof Date) return isNaN(str) ? null : str

		if (typeof str === 'number') {
			const d = new Date(str)

			return isNaN(d) ? null : d
		}

		if (typeof str !== 'string') {
			try {
				str = String(str)
			} catch (e) {
				return null
			}
		}

		if (/\d{4}-\d{2}-\d{2}T/.test(str)) {
			const d = new Date(str)

			return isNaN(d) ? null : d
		}

		const parts = str.split('/').map(p => p.trim())

		if (parts.length === 3) {
			const day = parseInt(parts[0], 10)
			const month = parseInt(parts[1], 10) - 1
			const year = parseInt(parts[2], 10)
			const d = new Date(year, month, day)

			return isNaN(d) ? null : d
		}

		return null
	}

	const getServiceSubtitle = item => {
		const slas = Array.isArray(item?.slas) ? item.slas : []

		const dates = slas
			.map(sla => sla.shippingEstimateDate || sla.formattedShippingEstimate)
			.map(parseDateFromString)
			.filter(d => d instanceof Date && !isNaN(d))

		if (dates.length > 0) {
			const today = new Date()

			today.setHours(0, 0, 0, 0)
			const minDate = new Date(Math.min(...dates.map(d => d.getTime())))

			minDate.setHours(0, 0, 0, 0)
			const diffMs = minDate.getTime() - today.getTime()
			const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

			if (diffDays <= 0) return 'Receba em até 0 dias'

			return `Receba em até ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`
		}

		const title = getServiceTitle(item)

		return title.toLowerCase().includes('sedex') ? 'o mais rápido' : 'o mais lerdo'
	}

	return (
		<Page
			title='Checkout - Frete e Entrega'
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

			<View className='flex flex-col gap-4 px-2.5 pb-8 overflow-auto max-h-[70vh]'>
				<CartItemsContent />

				<View className='flex flex-col gap-2'>
					<Text className='text-xl  text-black'>Formas de Entrega</Text>
				</View>

				<View className='flex flex-col w-full gap-4'>
					{deliveryOptions.map((item, index) => (
						<CardSelector
							key={index}
							mainTitle={getServiceTitle(item)}
							selectable={true}
							checked={item.isCurrent}
							onSelect={() => onSelectFreightOption(item)}
							radioName='freight-option-delivery'>
							<View className='mb-2'>
								<Text className='text-xs  text-neutral-700'>{getServiceSubtitle(item)}</Text>
							</View>

							<Text className='font-medium text-xs text-gray-500'>{item?.price}</Text>
						</CardSelector>
					))}
				</View>
			</View>

			<FixedBottom className='flex flex-col align-center gap-4'>
				<CustomButton
					disabled={!deliveryOptions?.some(item => item.isCurrent)}
					label={'CONTINUAR PARA COMPRA'}
					onClick={submit}
				/>
			</FixedBottom>

			<BottomInset />
		</Page>
	)
}
