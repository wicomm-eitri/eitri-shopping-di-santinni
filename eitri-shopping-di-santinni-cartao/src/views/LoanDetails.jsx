import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton, Loading } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import { getFirstInstallmentDate, getLoanInstallments, LOAN_INTEREST_INFO } from '../services/CardService'
import { navigate, PAGES } from '../services/NavigationService'
import InfoGrayIcon from '../assets/icons/info-gray.svg'
import { formatDate, formatPrice } from '../utils/utils'

export default function LoanDetails(props) {
	const amount = props?.location?.state?.amount || 0
	const initialInstallments = props?.location?.state?.installments || 0

	const [installmentOptions, setInstallmentOptions] = useState(null)
	const [selectedInstallments, setSelectedInstallments] = useState(initialInstallments)

	useEffect(() => {
		loadInstallments()
	}, [])

	const loadInstallments = async () => {
		try {
			const data = await getLoanInstallments(amount)

			setInstallmentOptions(data)
		} catch (e) {
			console.error('loadInstallments error:', e)
		}
	}

	const sortedOptions = installmentOptions
		? [...installmentOptions].sort((a, b) => a.installments - b.installments)
		: []

	const selectedIndex = sortedOptions.findIndex(option => option.installments === selectedInstallments)

	const selectedOption = sortedOptions[selectedIndex]

	const canDecrease = selectedIndex > 0

	const canIncrease = selectedIndex >= 0 && selectedIndex < sortedOptions.length - 1

	const changeInstallments = step => {
		const nextOption = sortedOptions[selectedIndex + step]

		if (nextOption) {
			setSelectedInstallments(nextOption.installments)
		}
	}

	const onBack = () => Eitri.navigation.back()

	const onPressContinue = () => navigate(PAGES.LOAN_BANK, { amount, installments: selectedOption.installments })

	return (
		<Page
			title='Condições de parcelamento - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={!installmentOptions}
				fullScreen={true}
			/>

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress currentStep={3} />

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Confira os detalhes
				</Text>

				{selectedOption && (
					<View className='flex flex-col gap-[25px]'>
						<View className='flex items-center justify-between h-[63px] p-[10px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.25)]'>
							<StepperButton
								label='-'
								disabled={!canDecrease}
								onPress={() => changeInstallments(-1)}
							/>

							<View className='flex flex-col items-center'>
								<Text className='text-base font-semibold leading-5 tracking-[0.28px] text-[#0C0C0C]'>
									{selectedOption.installments}{' '}
									{selectedOption.installments === 1 ? 'parcela' : 'parcelas'}
								</Text>

								<Text className='text-[10px] leading-5 tracking-[0.28px] text-[#888888]'>
									de {formatPrice(selectedOption.installmentValue)}
								</Text>
							</View>

							<StepperButton
								label='+'
								disabled={!canIncrease}
								onPress={() => changeInstallments(1)}
							/>
						</View>

						<View className='flex flex-col items-center gap-[10px] p-[10px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
							<View className='flex flex-col gap-[25px] text-center'>
								<Text className='text-xs leading-5 tracking-[0.24px] text-gray-700'>
									Valor depositado para você
								</Text>

								<Text className='text-[32px] font-semibold leading-5 tracking-[0.64px] text-[#1A7F4B]'>
									{formatPrice(amount)}
								</Text>

								<Text className='text-xs leading-5 tracking-[0.24px] text-gray-700'>
									O crédito será depositado na sua conta logo após a confirmação da contratação
								</Text>
							</View>

							<LoanDetailRow
								label='Valor das parcelas'
								value={`${selectedOption.installments}x de ${formatPrice(selectedOption.installmentValue)}`}
							/>

							<LoanDetailRow
								label='Data da primeira parcela'
								value={formatDate(getFirstInstallmentDate())}
							/>

							<LoanDetailRow
								label='Juros + IOF'
								value={`+ ${formatPrice(selectedOption.totalValue - amount)}`}
							/>

							<LoanDetailRow
								label='Valor Total'
								value={formatPrice(selectedOption.totalValue)}
								highlightLabel
							/>
						</View>

						<View className='flex items-center gap-[10px] p-[10px] rounded-lg bg-[#F5E8EB] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
							<Image
								src={InfoGrayIcon}
								alt=''
								className='shrink-0 w-[22px] h-[22px]'
							/>

							<View className='flex flex-col gap-[5px]'>
								<Text className='text-sm font-semibold leading-5 tracking-[0.28px] text-[#0C0C0C]'>
									Informações sobre taxa de juros
								</Text>

								<View className='flex flex-col'>
									{LOAN_INTEREST_INFO.map(info => (
										<Text
											key={info}
											className='text-[10px] leading-5 tracking-[0.2px] text-gray-700'>
											{info}
										</Text>
									))}
								</View>
							</View>
						</View>
					</View>
				)}

				<CustomButton
					label='Continuar'
					disabled={!selectedOption}
					className='!h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressContinue}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}

function StepperButton(props) {
	const { label, disabled, onPress } = props

	return (
		<View
			className={`flex items-center justify-center w-7 h-7 rounded-full ${disabled ? 'opacity-40' : ''}`}
			onClick={disabled ? undefined : onPress}>
			<Text
				className={`text-4xl font-semibold leading-5 tracking-[0.72px] ${disabled ? 'text-[#888888]' : 'text-[#0C0C0C]'}`}>
				{label}
			</Text>
		</View>
	)
}

function LoanDetailRow(props) {
	const { label, value, highlightLabel } = props

	return (
		<View className='flex items-center justify-between w-full h-[30px]'>
			<Text
				className={`text-xs leading-5 tracking-[0.24px] text-[#0C0C0C] ${highlightLabel ? 'font-semibold' : ''}`}>
				{label}
			</Text>

			<Text className='text-sm font-semibold leading-5 tracking-[0.28px] text-right text-[#0C0C0C]'>{value}</Text>
		</View>
	)
}
