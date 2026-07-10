import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'eitri-i18n'
import { CustomButton, CustomInput } from 'eitri-shopping-di-santinni-shared'
import { useCustomer } from '../../../providers/Customer'
import { useLocalShoppingCart } from '../../../providers/LocalCart'
import CardIcon from '../../Icons/CardIcons/CardIcon'
import Card from '../../Icons/MethodIcons/Card'
import GroupsWrapper from './GroupsWrapper'

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

export default function CreditCard(props) {
	const { onSelectPaymentMethod, systemGroup, selectedPayment } = props
	const { cart, setCardInfo, cardInfo, removeAccount, selectPaymentOption } = useLocalShoppingCart()
	const { checkoutProfile, getCustomer } = useCustomer()
	const { t } = useTranslation()

	const isChecked = (() => {
		if (selectedPayment) {
			const candidates = systemGroup?.paymentSystems?.map(ps => ps.id) || []

			return Array.isArray(selectedPayment)
				? selectedPayment.some(p => candidates.includes(p.paymentSystem))
				: candidates.includes(selectedPayment.paymentSystem)
		}

		return systemGroup?.isCurrentPaymentSystemGroup
	})()

	const onSelectThisGroup = async () => {
		if (systemGroup?.paymentSystems?.length > 0) {
			await onSelectPaymentMethod([{ paymentSystem: systemGroup.paymentSystems[0].id, isReadyToPay: false }])
		}
	}

	const [availableAccounts, setAvailableAccounts] = useState([])
	const [accountSelected, setAccountSelected] = useState(null)
	const [accountToRemove, setAccountToRemove] = useState(null)
	const [otpLogin, setOtpLogin] = useState(false)
	const [loadingRemoveCard, setLoadingRemoveCard] = useState(false)

	// New card form states
	const [showNewCardForm, setShowNewCardForm] = useState(false)
	const [formCardInfo, setFormCardInfo] = useState({
		cardNumber: '',
		holderName: '',
		month: '',
		year: '',
		validationCode: ''
	})
	const [selectedInstallment, setSelectedInstallment] = useState(null)
	const [validCard, setValidCard] = useState(false)
	const [paymentSystemName, setPaymentSystemName] = useState('')
	const [identifiedPaymentSystem, setIdentifiedPaymentSystem] = useState(null)
	const [installmentsLoading, setInstallmentsLoading] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	useEffect(() => {
		if (loadingRemoveCard) return

		if (checkoutProfile?.availableAccounts || cart?.paymentData?.availableAccounts) {
			const cards = assetUniqueCards(checkoutProfile?.availableAccounts || cart?.paymentData?.availableAccounts)

			setAvailableAccounts(cards)

			if (cards.length === 0) {
				setShowNewCardForm(true)
			}
		} else {
			setShowNewCardForm(true)
		}
	}, [checkoutProfile, cart])

	const assetUniqueCards = accounts => {
		const cards = []

		accounts.forEach(account => {
			if (!cards.some(card => card.cardNumber === account.cardNumber)) {
				cards.push(account)
			}
		})

		return cards
	}

	// Local installments options based on the identified system
	const installmentOptions = useMemo(() => {
		if (!identifiedPaymentSystem) return []

		const option = cart?.paymentData?.installmentOptions?.find(
			i => i.paymentSystem === identifiedPaymentSystem.stringId
		)

		return option?.installments || []
	}, [cart?.paymentData?.installmentOptions, identifiedPaymentSystem])

	const findPaymentSystem = cardNumber => {
		return systemGroup?.paymentSystems?.find(method => {
			const regex = RegExp(method.validator.regex)

			return regex.test(cardNumber.replace(/\D+/g, ''))
		})
	}

	// Fetch installments automatically when BIN is valid
	useEffect(() => {
		const checkAndFetchInstallments = async () => {
			if (formCardInfo?.cardNumber && formCardInfo?.cardNumber.length > 14) {
				const ps = findPaymentSystem(formCardInfo.cardNumber)

				if (ps) {
					setValidCard(true)
					setPaymentSystemName(ps.name)

					// Only fetch if it's a new payment system to avoid infinite loops
					if (ps.id !== identifiedPaymentSystem?.id) {
						setIdentifiedPaymentSystem(ps)

						try {
							setInstallmentsLoading(true)
							const payload = {
								payments: [
									{
										paymentSystem: ps.id,
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
	}, [formCardInfo?.cardNumber])

	const handleCardDataChange = (key, value) => {
		setFormCardInfo(prev => ({ ...prev, [key]: value }))
	}

	const formatAmountInCents = value => {
		return (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
	}

	const validDueDate = useMemo(() => {
		if (!formCardInfo.month || !formCardInfo.year) return false

		const month = parseInt(formCardInfo.month, 10)
		const year = parseInt(formCardInfo.year, 10)
		const now = new Date()
		const currentYear = now.getFullYear()
		const currentMonth = now.getMonth() + 1

		if (year === currentYear && month >= currentMonth) return true

		if (year > currentYear) return true

		return false
	}, [formCardInfo.month, formCardInfo.year])

	const validToProceedNewCard = () => {
		return (
			validCard &&
			!!formCardInfo?.holderName &&
			validDueDate &&
			formCardInfo?.validationCode?.length >= 3 &&
			!!selectedInstallment
		)
	}

	useEffect(() => {
		let isReady = false
		let paymentPayload = null

		if (showNewCardForm) {
			if (validToProceedNewCard() && identifiedPaymentSystem) {
				isReady = true
				const ps = identifiedPaymentSystem
				const formattedDueDate = `${formCardInfo.month.padStart(2, '0')}/${formCardInfo.year.slice(-2)}`

				setCardInfo({
					...cardInfo,
					...formCardInfo,
					dueDate: formattedDueDate
				})

				paymentPayload = {
					paymentSystem: ps.id,
					installmentsInterestRate: selectedInstallment?.interestRate ?? 0,
					installments: selectedInstallment.count,
					referenceValue: cart.value,
					value: cart.value,
					hasDefaultBillingAddress: true,
					isReadyToPay: true
				}
			}
		} else {
			if (accountSelected && selectedInstallment && cardInfo?.validationCode?.length >= 3) {
				isReady = true
				const ps = systemGroup?.paymentSystems?.find(s => s.stringId === accountSelected?.paymentSystem)

				if (ps) {
					paymentPayload = {
						paymentSystem: ps.id,
						installmentsInterestRate: selectedInstallment?.interestRate ?? 0,
						installments: selectedInstallment.count,
						referenceValue: cart.value,
						value: cart.value,
						hasDefaultBillingAddress: true,
						isReadyToPay: true
					}
				}
			}
		}

		if (isReady && paymentPayload) {
			onSelectPaymentMethod([paymentPayload])
		} else {
			if (systemGroup?.paymentSystems?.length > 0) {
				onSelectPaymentMethod([{ paymentSystem: systemGroup.paymentSystems[0].id, isReadyToPay: false }])
			}
		}
	}, [
		showNewCardForm,
		formCardInfo,
		selectedInstallment,
		identifiedPaymentSystem,
		accountSelected,
		cardInfo?.validationCode
	])

	// Saved card functions
	const selectCart = async account => {
		setAccountSelected(account)
		setCardInfo(account)

		const ps = systemGroup?.paymentSystems?.find(s => s.stringId === account?.paymentSystem)

		if (ps) {
			setIdentifiedPaymentSystem(ps)

			try {
				setInstallmentsLoading(true)
				await selectPaymentOption({
					payments: [
						{
							paymentSystem: ps.id,
							installmentsInterestRate: 0,
							installments: 1,
							referenceValue: cart.value,
							value: cart.value,
							hasDefaultBillingAddress: true
						}
					],
					giftCards: cart?.paymentData?.giftCards || []
				})
			} catch (e) {
				console.error(e)
			} finally {
				setInstallmentsLoading(false)
			}
		}
	}

	const removeAccountConfirm = async (e, account) => {
		e.stopPropagation()
		setAccountToRemove(account)
	}

	const removeUserAccount = async isRetrying => {
		try {
			setLoadingRemoveCard(true)
			setOtpLogin(false)
			const accounts = checkoutProfile?.availableAccounts || cart?.paymentData?.availableAccounts
			const accountsToRemove = accounts.filter(account => account.cardNumber === accountToRemove?.cardNumber)

			setAvailableAccounts(
				availableAccounts.filter(account => account.cardNumber !== accountToRemove?.cardNumber)
			)

			setAccountToRemove(null)

			for (const acc of accountsToRemove) {
				try {
					await removeAccount(acc.accountId)
				} catch (error) {
					console.error('Error removing account:', error)
				}
			}

			await getCustomer()
			setLoadingRemoveCard(false)
		} catch (e) {
			setLoadingRemoveCard(false)
		}
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

	return (
		<>
			<GroupsWrapper
				title={t('paymentMethods.creditCard.title', 'Cartão de Crédito')}
				icon={<Card />}
				onPress={onSelectThisGroup}
				selected={isChecked}
			/>

			{isChecked && (
				<View className='mt-2 mb-4 bg-white'>
					{/* Saved Cards */}
					{!showNewCardForm && availableAccounts?.length > 0 && (
						<View className='flex flex-col gap-3 p-4 border border-gray-200 rounded'>
							{availableAccounts?.map(account => (
								<View
									key={account.id}
									onClick={() => selectCart(account)}
									className={`p-3 border rounded r ${accountSelected?.id === account.id ? 'border-primary bg-red-50' : 'border-gray-200'}`}>
									<View className='flex flex-row items-top justify-between'>
										<View className='flex flex-row gap-2 items-top'>
											<CardIcon
												width={'30px'}
												iconKey={account?.paymentSystemName}
											/>
											<View className='flex flex-col'>
												<View className='flex items-center gap-2'>
													<Text className='text-sm font-bold'>{`${account?.paymentSystemName}`}</Text>
													<View
														onClick={e => removeAccountConfirm(e, account)}
														className='text-xs text-primary font-semibold r'>
														({t('paymentMethods.creditCard.remove', 'Remover')})
													</View>
												</View>
												<Text className='text-sm'>
													{`${t('paymentMethods.creditCard.endingIn', 'final')} ${account?.cardNumber?.replaceAll('*', '')}`}
												</Text>
											</View>
										</View>

										<View className='flex flex-row gap-2 items-center'>
											<View
												className={`w-5 h-5 rounded-full border-[1.5px] ${accountSelected?.id === account.id ? 'border-primary' : 'border-gray-300'} bg-white flex items-center justify-center`}>
												{accountSelected?.id === account.id && (
													<View className='w-2.5 h-2.5 rounded-full bg-primary' />
												)}
											</View>
										</View>
									</View>

									{accountSelected?.id === account.id && (
										<View className='flex flex-col gap-4 mt-4'>
											<View className='w-full sm:w-1/2'>
												<CustomInput
													inputMode='numeric'
													variant='mask'
													mask='9999'
													label={t(
														'paymentMethods.creditCard.securityCode',
														'Cód. Segurança (CVV)'
													)}
													placeholder={'***'}
													value={cardInfo?.validationCode || ''}
													onChange={e =>
														setCardInfo({ ...cardInfo, validationCode: e.target.value })
													}
												/>
											</View>

											<View className='flex flex-col gap-1 w-full'>
												<Text className='text-xs font-bold text-gray-800 mb-1'>
													Parcelamento
												</Text>
												{renderInstallmentsSelect()}
											</View>
										</View>
									)}
								</View>
							))}

							<View
								onClick={() => setShowNewCardForm(true)}
								className='mt-2 r p-2 flex items-center justify-center border border-dashed border-gray-300 rounded'>
								<Text className='text-primary font-bold text-sm'>
									{t('paymentMethods.creditCard.newCard', '+ Novo Cartão')}
								</Text>
							</View>
						</View>
					)}

					{/* New Card Inline Form */}
					{showNewCardForm && (
						<View className='flex flex-col gap-4 p-4 border border-red-700 rounded-b border-t-0 -mt-2'>
							<View className='w-full flex justify-end'>
								{availableAccounts?.length > 0 && (
									<Text
										className='text-primary text-xs underline r font-semibold'
										onClick={() => setShowNewCardForm(false)}>
										Voltar para cartões salvos
									</Text>
								)}
							</View>

							<View className='flex flex-col gap-1 w-full'>
								<Text className='text-xs font-bold text-gray-800 ml-1'>Número do cartão</Text>
								<View className='relative'>
									<CustomInput
										placeholder={'0000 0000 0000 0000'}
										value={formCardInfo.cardNumber}
										inputMode='numeric'
										mask='9999 9999 9999 9999'
										variant='mask'
										onChange={e => handleCardDataChange('cardNumber', e.target.value)}
									/>
									{paymentSystemName && (
										<View className='absolute top-[8px] right-3'>
											<CardIcon
												height={25}
												width={39}
												iconKey={paymentSystemName}
											/>
										</View>
									)}
								</View>
							</View>

							<View className='flex flex-col gap-1 w-full'>
								<Text className='text-xs font-bold text-gray-800 ml-1'>Nome impresso no cartão</Text>
								<CustomInput
									showClearInput={false}
									placeholder={'Nome e sobrenome'}
									value={formCardInfo.holderName}
									onChange={e => handleCardDataChange('holderName', e.target.value)}
								/>
							</View>

							<View className='flex gap-4 w-full flex-row'>
								<View className='flex flex-col gap-1 w-1/2'>
									<Text className='text-xs font-bold text-gray-800 ml-1'>Mês</Text>
									<CustomDropdown
										value={formCardInfo.month}
										placeholder='Mês'
										options={Array.from({ length: 12 }, (_, i) => {
											const m = (i + 1).toString().padStart(2, '0')

											return { value: m, label: m }
										})}
										onChange={val => handleCardDataChange('month', val)}
									/>
								</View>

								<View className='flex flex-col gap-1 w-1/2'>
									<Text className='text-xs font-bold text-gray-800 ml-1'>Ano</Text>
									<CustomDropdown
										value={formCardInfo.year}
										placeholder='Ano'
										options={Array.from({ length: 15 }, (_, i) => {
											const y = (new Date().getFullYear() + i).toString()

											return { value: y, label: y }
										})}
										onChange={val => handleCardDataChange('year', val)}
									/>
								</View>
							</View>

							<View className='flex flex-col gap-1 w-full'>
								<Text className='text-xs font-bold text-gray-800 ml-1'>Código de segurança (CVV)</Text>
								<CustomInput
									placeholder={'***'}
									value={formCardInfo.validationCode}
									onChange={e => handleCardDataChange('validationCode', e.target.value)}
									inputMode='numeric'
									variant='mask'
									mask='9999'
								/>
							</View>

							<View className='flex flex-col gap-1 w-full mt-2'>
								<Text className='text-xs font-bold text-gray-800 ml-1'>Parcelamento</Text>
								{renderInstallmentsSelect()}
							</View>
						</View>
					)}
				</View>
			)}

			{accountToRemove && (
				<View
					className='z-[9999] !bg-black/70 !opacity-100 fixed inset-0 flex items-center justify-center'
					onClick={() => {
						setAccountToRemove(null)
					}}>
					<View
						onClick={e => e.stopPropagation()}
						className='bg-white !rounded-t-sm max-w-[80%] max-h-[70vh] overflow-y-auto pointer-events-auto p-4'>
						<Text className='text-lg font-semibold'>
							{`${t('paymentMethods.creditCard.confirmRemove', 'Deseja remover o cartão final')} ${accountToRemove?.cardNumber?.replaceAll('*', '')}`}
						</Text>

						<View className='flex flex-col mt-5 gap-3'>
							<CustomButton
								label={t('paymentMethods.creditCard.yes', 'Sim')}
								onClick={removeUserAccount}
							/>
							<CustomButton
								outlined
								label={t('paymentMethods.creditCard.no', 'Não')}
								onClick={() => setAccountToRemove(null)}
							/>
						</View>
					</View>
				</View>
			)}
		</>
	)
}
