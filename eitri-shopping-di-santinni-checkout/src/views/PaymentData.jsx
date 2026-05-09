import { useEffect, useState } from 'react'
import { useTranslation } from 'eitri-i18n'
import {
	BottomInset,
	CustomButton,
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	Steps
} from 'eitri-shopping-di-santinni-shared'
import CartItemsContent from '../components/CartItemsContent/CartItemsContent'
import PaymentMethods from '../components/Methods/PaymentMethods'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { trackScreenView } from '../services/Tracking'
import { navigate } from '../services/navigationService'

export default function PaymentData() {
	const { cart, selectPaymentOption } = useLocalShoppingCart()
	const [isLoading, setIsLoading] = useState(false)
	const [selectedPayment, setSelectedPayment] = useState(null)
	const { t } = useTranslation()

	useEffect(() => {
		trackScreenView(`checkout_dados_pagamento`, 'checkout.paymentData')
	}, [])

	const handlePaymentMethodPick = paymentMethod => setSelectedPayment(paymentMethod)

	const applySelectedPayment = async () => {
		if (!selectedPayment) return

		try {
			setIsLoading(true)

			const payload = {
				payments: Array.isArray(selectedPayment) ? selectedPayment : [selectedPayment],
				giftCards: cart.paymentData.giftCards
			}

			await selectPaymentOption(payload)

			navigate('CheckoutReview', {}, true)
		} catch (error) {
			console.error('Erro ao selecionar método de pagamento', error)
		} finally {
			setIsLoading(false)
		}
	}

	if (!cart) return

	return (
		<Page
			title='Checkout - Dados de pagamento'
			className='bg-white'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={'Checkout'} />
			</HeaderContentWrapper>

			<Steps current={1} />

			<LoadingComponent
				fullScreen
				isLoading={isLoading}
			/>

			<View className='flex flex-col gap-4 px-2.5 pb-8 overflow-auto max-h-[70vh]'>
				<CartItemsContent />

				<Text className='text-sm  font-medium text-black'>
					{t('paymentData.txtSelectPayment', 'FORMAS DE PAGAMENTO')}
				</Text>

				<PaymentMethods
					onSelectPaymentMethod={handlePaymentMethodPick}
					selectedPayment={selectedPayment}
				/>
			</View>

			<View className='fixed bottom-0 left-0 w-full z-10 bg-white border-t border-gray-300'>
				<View className='p-4'>
					<CustomButton
						disabled={!selectedPayment}
						label={'CONTINUAR PARA COMPRA'}
						onPress={applySelectedPayment}
					/>
				</View>

				<BottomInset />
			</View>
		</Page>
	)
}
