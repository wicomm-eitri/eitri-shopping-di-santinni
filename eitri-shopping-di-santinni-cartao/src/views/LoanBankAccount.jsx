import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton, CustomInput } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import RadioOption from '../components/RadioOption/RadioOption'
import { navigate, PAGES } from '../services/NavigationService'
import ChevronIcon from '../assets/icons/chevron-left.svg'
import InfoGrayIcon from '../assets/icons/info-gray.svg'

const ACCOUNT_TYPES = [
	{ id: 'checking', label: 'Conta Corrente' },
	{ id: 'savings', label: 'Conta Poupança' }
]

const onlyNumbers = value => (value || '').replace(/\D/g, '')

export default function LoanBankAccount(props) {
	const state = props?.location?.state || {}

	const bank = state.bank || null
	const amount = state.amount || 0
	const installments = state.installments || 0

	const [accountType, setAccountType] = useState(ACCOUNT_TYPES[0].id)
	const [agency, setAgency] = useState('')
	const [account, setAccount] = useState('')
	const [digit, setDigit] = useState('')

	const canSubmit = !!bank && !!agency && !!account && !!digit

	const onBack = () => Eitri.navigation.back()

	const onChangeField = setter => e => setter(onlyNumbers(e?.target ? e.target.value : e))

	const onPressContinue = () => {
		const selectedType = ACCOUNT_TYPES.find(type => type.id === accountType)

		navigate(PAGES.LOAN_SUMMARY, {
			amount,
			installments,
			bank,
			accountTypeLabel: selectedType ? selectedType.label : '',
			agency,
			account,
			digit
		})
	}

	return (
		<Page
			title='Dados bancários - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress currentStep={5} />

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Informe os dados da conta
				</Text>

				<View className='flex flex-col gap-[10px]'>
					{ACCOUNT_TYPES.map(type => (
						<RadioOption
							key={type.id}
							label={type.label}
							selected={accountType === type.id}
							onPress={() => setAccountType(type.id)}
						/>
					))}
				</View>

				<View className='w-full h-px bg-[#CCCCCC]' />

				<View
					className='flex items-center justify-between h-[50px] px-[10px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'
					onClick={onBack}>
					{bank ? (
						<View className='flex items-center gap-5'>
							<Text className='text-xs font-semibold leading-5 tracking-[0.24px] text-[#888888]'>
								{bank.code}
							</Text>

							<Text className='text-xs leading-5 tracking-[0.24px] text-[#888888]'>{bank.name}</Text>
						</View>
					) : (
						<Text className='text-xs leading-5 tracking-[0.24px] text-[#888888]'>
							Nenhuma instituição selecionada
						</Text>
					)}

					<View className='flex items-center gap-[10px]'>
						<Text className='text-xs leading-5 tracking-[0.24px] text-[#0C0C0C]'>
							{bank ? 'Trocar' : 'Selecionar'}
						</Text>

						<Image
							src={ChevronIcon}
							alt=''
							className='w-5 h-5 rotate-180'
						/>
					</View>
				</View>

				<View className='flex items-center gap-[10px] p-[10px] rounded-lg bg-[#F5E8EB] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
					<Image
						src={InfoGrayIcon}
						alt=''
						className='shrink-0 w-[22px] h-[22px]'
					/>

					<Text className='text-[10px] leading-5 tracking-[0.2px] text-gray-700'>
						Você deve ser o titular da conta para o qual fará a TED do valor do empréstimo
					</Text>
				</View>

				<View className='flex flex-col gap-[10px]'>
					<BankField
						value={agency}
						placeholder='Agência'
						onChange={onChangeField(setAgency)}
					/>

					<View className='flex gap-[10px]'>
						<BankField
							value={account}
							placeholder='Conta'
							onChange={onChangeField(setAccount)}
						/>

						<BankField
							value={digit}
							placeholder='Dígito'
							onChange={onChangeField(setDigit)}
						/>
					</View>
				</View>

				<CustomButton
					label='Continuar'
					disabled={!canSubmit}
					className='!h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressContinue}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}

function BankField(props) {
	const { value, placeholder, onChange } = props

	return (
		<View className='flex flex-1 items-center h-11 px-4 rounded bg-white border border-[#D4D4D4]'>
			<CustomInput
				value={value}
				placeholder={placeholder}
				inputMode='numeric'
				onChange={onChange}
				className='!h-10 !p-0 !border-0 !bg-transparent text-sm text-black tracking-[0.28px]'
			/>
		</View>
	)
}
