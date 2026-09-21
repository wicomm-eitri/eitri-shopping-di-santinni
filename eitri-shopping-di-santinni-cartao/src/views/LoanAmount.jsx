import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton, CustomInput } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import InfoIcon from '../assets/icons/info.svg'
import { formatPrice } from '../utils/utils'
import { navigate, PAGES } from '../services/NavigationService'

const MIN_LOAN_AMOUNT = 275

const formatAmount = value =>
	value === null ? '' : value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const parseAmount = text => {
	const digits = (text || '').replace(/\D/g, '')

	return digits ? Number(digits) / 100 : null
}

export default function LoanAmount(props) {
	const preApprovedAmount = props?.location?.state?.preApprovedAmount || 0

	const [amount, setAmount] = useState(null)

	const isValidAmount = amount !== null && amount >= MIN_LOAN_AMOUNT && amount <= preApprovedAmount

	const showAmountError = amount !== null && !isValidAmount

	const onBack = () => Eitri.navigation.back()

	const onChangeAmount = e => setAmount(parseAmount(e.target ? e.target.value : e))

	const onPressConfirm = () => navigate(PAGES.LOAN_INSTALLMENTS, { amount })

	return (
		<Page
			title='Valor desejado - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress currentStep={1} />

				<View className='flex flex-col gap-3'>
					<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
						Informe o valor desejado
					</Text>

					<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
						Valor pré-aprovado: {formatPrice(preApprovedAmount)}
					</Text>
				</View>

				<View className='flex flex-col gap-[25px]'>
					<View className='flex flex-col gap-[10px]'>
						<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>Valor Solicitado:</Text>

						<View className='flex items-center gap-1 w-full h-[42px] px-4 rounded bg-white border border-[#D4D4D4]'>
							<Text className='shrink-0 text-sm leading-5 tracking-[0.28px] text-[#888888]'>R$</Text>

							<View className='flex-1'>
								<CustomInput
									value={formatAmount(amount)}
									placeholder='0,00'
									inputMode='numeric'
									onChange={onChangeAmount}
									className='!h-10 !p-0 !border-0 !bg-transparent text-sm text-black tracking-[0.28px]'
								/>
							</View>
						</View>

						<Text className={`text-[10px] leading-5 tracking-[0.2px] ${showAmountError ? 'text-red-700' : 'text-gray-700'}`}>
							Digite um valor entre {formatPrice(MIN_LOAN_AMOUNT)} e {formatPrice(preApprovedAmount)}
						</Text>
					</View>

					<View className='flex items-center gap-[10px] p-[10px] rounded-lg bg-[#F5E8EB] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
						<Image
							src={InfoIcon}
							alt=''
							className='shrink-0 w-[22px] h-[22px]'
						/>

						<Text className='text-[10px] leading-5 tracking-[0.2px] text-gray-700'>
							A transferência para outro banco é via TED e está sujeita aos seus horários de processamento
						</Text>
					</View>
				</View>

				<CustomButton
					label='Confirmar'
					disabled={!isValidAmount}
					className='!h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressConfirm}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}
