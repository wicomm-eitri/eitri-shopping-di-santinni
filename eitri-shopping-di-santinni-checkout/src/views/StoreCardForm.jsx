import { useMemo, useState, useEffect } from 'react'
import {
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	CustomInput,
	CustomButton,
	BottomInset
} from 'eitri-shopping-di-santinni-shared'
import FixedBottom from '../components/FixedBottom/FixedBottom'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { trackScreenView } from '../services/Tracking'
import { navigate } from '../services/navigationService'
import { getPaymentSystem } from '../utils/getPaymentSystem'
import { verifySocialNumber } from '../utils/verifySocialNumber'

const CustomDropdown = ({ value, options, onChange, placeholder }) => {
	const [isOpen, setIsOpen] = useState(false)
	const selectedOption = options.find(o => o.value === value)

	return (
		<View className='w-full'>
			<View
				className='w-full border border-gray-300 p-3 rounded bg-white flex flex-row items-center justify-between'
				onClick={() => setIsOpen(!isOpen)}>
				<Text className='text-sm text-gray-700'>{selectedOption ? selectedOption.label : placeholder}</Text>
				<View className='transform pointer-events-none'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='#6b7280'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<polyline points='6 9 12 15 18 9'></polyline>
					</svg>
				</View>
			</View>
			{isOpen && (
				<View
					className='fixed inset-0 z-[99999] bg-black/50 flex flex-col justify-end'
					onClick={() => setIsOpen(false)}>
					<View
						className='bg-white w-full rounded-t-xl max-h-[60vh] flex flex-col pb-4 shadow-2xl'
						onClick={e => e.stopPropagation()}>
						<View className='p-4 border-b border-gray-200 flex flex-row justify-between items-center'>
							<Text className='font-bold text-lg'>{placeholder}</Text>
							<View
								onClick={() => setIsOpen(false)}
								className='p-2 r'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'>
									<line
										x1='18'
										y1='6'
										x2='6'
										y2='18'></line>
									<line
										x1='6'
										y1='6'
										x2='18'
										y2='18'></line>
								</svg>
							</View>
						</View>
						<View className='overflow-y-auto px-2'>
							{options.map((opt, i) => (
								<View
									key={i}
									className={`p-4 mx-2 my-1 rounded flex flex-row items-center justify-between r ${value === opt.value ? 'bg-red-50 border border-red-200' : 'bg-white border border-transparent hover:bg-gray-50'}`}
									onClick={() => {
										onChange(opt.value)
										setIsOpen(false)
									}}>
									<Text
										className={`text-base ${value === opt.value ? 'text-primary font-bold' : 'text-gray-700'}`}>
										{opt.label}
									</Text>
									{value === opt.value && (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											width='20'
											height='20'
											viewBox='0 0 24 24'
											fill='none'
											stroke='#b91c1c'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'>
											<polyline points='20 6 9 17 4 12'></polyline>
										</svg>
									)}
								</View>
							))}
						</View>
					</View>
				</View>
			)}
		</View>
	)
}

export default function StoreCardForm(props) {
	const { cart, setCardInfo, selectPaymentOption } = useLocalShoppingCart()

	const PAGE = 'Checkout - Cartão Di Santinni'

	const systemGroup = props.location?.state?.systemGroup
	const propCardNumber = props.location?.state?.cardNumber

	const [selectedPaymentSystem, setSelectedPaymentSystem] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const [cardData, setCardData] = useState({
		cardNumber: propCardNumber || '',
		holderName: '',
		expirationDate: '',
		validationCode: '',
		document: ''
	})

	const [validCvv, setValidCvv] = useState(false)

	const [validDueDate, setValidDueDate] = useState(false)
	const [validCard, setValidCard] = useState(false)
	const [validDocument, setValidDocument] = useState(false)

	const [selectedInstallment, setSelectedInstallment] = useState(null)
	const [installmentsLoading, setInstallmentsLoading] = useState(false)
	const [identifiedPaymentSystem, setIdentifiedPaymentSystem] = useState(null)

	useEffect(() => {
		trackScreenView(PAGE, 'checkout.StoreCardForm')
	}, [])

	useEffect(() => {
		const checkAndFetchInstallments = async () => {
			if (cardData?.cardNumber && cardData?.cardNumber.length > 18) {
				const paymentSystem = findPaymentSystem(cardData?.cardNumber)
				let psToUse = paymentSystem

				if (!psToUse) {
					const paymentSystemGroups = getPaymentSystem(cart)
					const storeCardSystemGroup = paymentSystemGroups?.find(
						ps => ps.groupName === 'creditCardPaymentGroup'
					)

					if (storeCardSystemGroup) {
						const isStoreCard = storeCardSystemGroup?.paymentSystems?.some(method => {
							const regex = RegExp(method?.validator?.regex)

							return regex.test(cardData?.cardNumber?.replace(/\D+/g, ''))
						})

						if (isStoreCard) {
							navigate('AddCardForm', { cardNumber: cardData?.cardNumber }, true)

							return
						}
					}

					let fallbackSystem = systemGroup?.paymentSystems?.[0]

					if (!fallbackSystem) {
						fallbackSystem = paymentSystemGroups?.find(ps => ps.groupName === 'customPrivate_DS')
							?.paymentSystems?.[0]
					}

					psToUse = fallbackSystem
				}

				if (psToUse) {
					setValidCard(true)
					setSelectedPaymentSystem(psToUse)

					if (psToUse.id !== identifiedPaymentSystem?.id) {
						setIdentifiedPaymentSystem(psToUse)

						try {
							setInstallmentsLoading(true)
							const payload = {
								payments: [
									{
										paymentSystem: psToUse.id,
										installmentsInterestRate: 0,
										installments: 1,
										referenceValue: cart.value,
										value: cart.value,
										hasDefaultBillingAddress: true
									}
								],
								giftCards: cart?.paymentData?.giftCards || []
							}

							await selectPaymentOption(payload)
						} catch (e) {
							console.error('Error fetching installments', e)
						} finally {
							setInstallmentsLoading(false)
						}
					}
				} else {
					setValidCard(false)
					setIdentifiedPaymentSystem(null)
				}
			} else {
				setValidCard(false)
				setIdentifiedPaymentSystem(null)
			}
		}

		checkAndFetchInstallments()
	}, [cardData.cardNumber])

	useEffect(() => {
		if (!cardData?.expirationDate) {
			return setValidDueDate(false)
		}

		const value = cardData?.expirationDate?.replace(/[\s_]/g, '')

		const regex = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/

		if (!regex.test(value)) return setValidDueDate(false)

		let [month, year] = value.split('/').map(Number)

		if (year < 100) year += 2000

		const now = new Date()
		const currentYear = now.getFullYear()
		const currentMonth = now.getMonth() + 1

		if (year === currentYear && month >= currentMonth) {
			return setValidDueDate(true)
		}

		if (year > currentYear) {
			return setValidDueDate(true)
		}

		return setValidDueDate(false)
	}, [cardData?.expirationDate])

	useEffect(() => {
		if (!cardData?.validationCode) return setValidCvv(false)

		const regex = /^\d{3}$/

		setValidCvv(regex.test(cardData.validationCode))
	}, [cardData?.validationCode])

	useEffect(() => {
		if (!cardData?.document) {
			return setValidDocument(false)
		}

		const cleanDoc = cardData?.document?.replace(/\D/g, '')

		setValidDocument(verifySocialNumber(cleanDoc))
	}, [cardData?.document])

	const handleCardDataChange = (key, e) => {
		const value = e.target.value
		const cardInfo = { ...cardData, [key]: value }

		setCardData(cardInfo)
	}

	const findPaymentSystem = cardNumber => {
		return systemGroup?.paymentSystems?.find(method => {
			const regex = RegExp(method.validator.regex)

			return regex.test(cardNumber.replace(/\D+/g, ''))
		})
	}

	const setPaymentSystem = async () => {
		try {
			setIsLoading(true)

			if (selectedPaymentSystem && selectedInstallment) {
				const clearNumber = cardData?.cardNumber?.replace(/\D+/g, '')
				const bin = clearNumber ? clearNumber.slice(0, 6) : null

				const paymentPayload = {
					paymentSystem: selectedPaymentSystem.id,
					installmentsInterestRate: selectedInstallment.interestRate ?? 0,
					installments: selectedInstallment.count,
					referenceValue: cart.value,
					value: cart.value,
					hasDefaultBillingAddress: true,
					bin,
					accountId: null,
					tokenId: null,
					isLuhnValid: true,
					isRegexValid: true,
					isReadyToPay: true
				}

				const payload = {
					payments: [paymentPayload],
					giftCards: cart.paymentData?.giftCards || []
				}

				await selectPaymentOption(payload)
			}

			const formattedDueDate = (() => {
				const d = cardData?.expirationDate || ''
				const match = d.match(/^(0[1-9]|1[0-2])\/(\d{4})$/)

				if (match) {
					const month = match[1]
					const year = match[2].slice(-2)

					return `${month}/${year}`
				}

				return cardData?.dueDate || ''
			})()

			setCardInfo({ ...cardData, dueDate: formattedDueDate })
			navigate('CheckoutReview')
			setIsLoading(false)
		} catch (e) {
			setIsLoading(false)
		}
	}

	const validToProceed = () => {
		return validCard && !!cardData?.holderName && validDueDate && validDocument && validCvv && !!selectedInstallment
	}

	const installmentOptions = useMemo(() => {
		if (!identifiedPaymentSystem) return []

		const option = cart?.paymentData?.installmentOptions?.find(
			i => i.paymentSystem === identifiedPaymentSystem.stringId
		)

		return option?.installments || []
	}, [cart?.paymentData?.installmentOptions, identifiedPaymentSystem])

	const formatAmountInCents = value => {
		return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
	}

	const renderInstallmentsSelect = () => {
		if (installmentsLoading) {
			return <Text className='text-xs text-gray-500 my-2'>Carregando parcelas...</Text>
		}

		if (installmentOptions.length === 0) {
			return (
				<View className='w-full border border-gray-300 rounded bg-gray-50 p-3'>
					<Text className='text-sm text-gray-400'>Aguardando número do cartão...</Text>
				</View>
			)
		}

		const options = installmentOptions.map(inst => ({
			value: inst.count,
			label: `${inst.count}x ${formatAmountInCents(inst.value)} ${inst.hasInterestRate ? 'com juros' : 'sem juros'}`
		}))

		return (
			<CustomDropdown
				value={selectedInstallment?.count || ''}
				options={options}
				placeholder='Números de parcelas'
				onChange={val => {
					const option = installmentOptions.find(i => i.count === val)

					setSelectedInstallment(option)
				}}
			/>
		)
	}

	const screenWidth = window.innerWidth - 32
	const proportionalHeight = screenWidth * (726 / 1118)

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={'Cartão Di Santinni'} />
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen
				isLoading={isLoading}
			/>

			<View className='p-4 flex flex-col gap-4'>
				<View
					className='w-full relative'
					height={proportionalHeight}>
					<View
						className={'absolute flex flex-col left-4'}
						style={{ bottom: proportionalHeight * 0.13 }}>
						<Text className='text-sm text-black uppercase font-normal'>{cardData?.holderName}</Text>
						<Text className='text-xl font-bold tracking-wider'>{cardData?.cardNumber}</Text>
					</View>
				</View>

				<View className='bg-white rounded p-4 flex flex-col gap-2'>
					<View>
						<CustomInput
							placeholder={'Insira o número do seu cartão'}
							label={'Número do cartão'}
							value={cardData?.cardNumber}
							inputMode='numeric'
							mask='9999 9999 9999 9999'
							variant='mask'
							onChange={e => handleCardDataChange('cardNumber', e)}
							error={!validCard && cardData?.cardNumber && 'Verifique o número digitado'}
						/>
					</View>

					<CustomInput
						showClearInput={false}
						placeholder={'Nome do titular do cartão'}
						label={'Nome do titular do cartão'}
						value={cardData?.holderName}
						onChange={text => handleCardDataChange('holderName', text)}
					/>

					<View className='w-full flex flex-row gap-1'>
						<View className={'w-1/3'}>
							<CustomInput
								label='Validade'
								placeholder={'MM/AAAA'}
								value={cardData?.expirationDate}
								onChange={text => handleCardDataChange('expirationDate', text)}
								variant='mask'
								inputMode='numeric'
								mask='99/9999'
								error={!validDueDate && cardData?.expirationDate && 'Data inválida'}
							/>
						</View>

						<View className={'w-1/3'}>
							<CustomInput
								label='CVV'
								placeholder={'CVV'}
								value={cardData?.validationCode}
								onChange={text => handleCardDataChange('validationCode', text)}
								inputMode='numeric'
								variant='mask'
								mask='999'
								error={!validCvv && cardData?.validationCode && 'CVV inválido'}
							/>
						</View>

						<View className={'w-1/3'}>
							<CustomInput
								label='CPF'
								placeholder={'CPF'}
								value={cardData?.document}
								onChange={text => handleCardDataChange('document', text)}
								inputMode='numeric'
								variant='mask'
								mask='999.999.999-99'
								error={!validDocument && cardData?.document && 'Verifique o CPF digitado'}
							/>
						</View>
					</View>

					<View className='flex flex-col gap-1 w-full mt-2'>
						<Text className='text-xs font-bold text-gray-800 ml-1'>Parcelamento</Text>
						{renderInstallmentsSelect()}
					</View>
				</View>

				<BottomInset />
			</View>

			<FixedBottom
				className='flex flex-col align-center gap-4'
				offSetHeight={77}>
				<CustomButton
					label='Continuar'
					disabled={!validToProceed()}
					onClick={setPaymentSystem}
				/>
			</FixedBottom>
		</Page>
	)
}
