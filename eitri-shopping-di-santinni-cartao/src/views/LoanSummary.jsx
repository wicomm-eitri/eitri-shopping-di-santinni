import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text } from 'eitri-luminus'
import { BottomInset, CustomButton, Loading } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import {
	getAccountHolder,
	getFirstInstallmentDate,
	getLoanInstallments,
	getLoanIof,
	LOAN_RATES
} from '../services/CardService'
import { navigate, PAGES } from '../services/NavigationService'
import { formatDate, formatPrice, maskDocument } from '../utils/utils'

const UNAVAILABLE = 'Não informado'

export default function LoanSummary(props) {
	const state = props?.location?.state || {}

	const amount = state.amount || 0
	const installments = state.installments || 0
	const bank = state.bank || null
	const accountTypeLabel = state.accountTypeLabel || ''
	const agency = state.agency || ''
	const account = state.account || ''
	const digit = state.digit || ''

	const [installmentOptions, setInstallmentOptions] = useState(null)
	const [holder, setHolder] = useState(null)

	useEffect(() => {
		loadSummary()
	}, [])

	const loadSummary = async () => {
		try {
			const [options, accountHolder] = await Promise.all([getLoanInstallments(amount), getAccountHolder()])

			setInstallmentOptions(options)
			setHolder(accountHolder)
		} catch (e) {
			console.error('loadSummary error:', e)
			setInstallmentOptions([])
		}
	}

	const selectedOption = (installmentOptions || []).find(option => option.installments === installments) || null

	const iof = getLoanIof(amount)

	const totalInterest = selectedOption ? selectedOption.totalValue - amount - iof : 0

	const holderDocument = maskDocument(holder?.document)

	const accountNumber = account && digit ? `${account}-${digit}` : account

	const onBack = () => Eitri.navigation.back()

	const onPressContinue = () => navigate(PAGES.LOAN_TERMS)

	return (
		<Page
			title='Resumo das condições - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={!installmentOptions || !holder}
				fullScreen={true}
			/>

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress currentStep={6} />

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Resumo das Condições
				</Text>

				{selectedOption && (
					<View className='flex flex-col gap-[5px] p-[10px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
						<Text className='text-sm font-semibold leading-5 tracking-[0.28px] text-[#0C0C0C]'>
							Custo efetivo total (CET)
						</Text>

						<SummaryRow
							label='Valor solicitado'
							value={formatPrice(amount)}
						/>

						<SummaryRow
							label='IOF'
							value={formatPrice(iof)}
						/>

						<SummaryRow
							label='Taxa de juros'
							value={`${LOAN_RATES.monthlyInterest} % ao mês`}
							secondValue={`${LOAN_RATES.yearlyInterest} % ao ano`}
						/>

						<SummaryRow
							label='Juros total'
							value={formatPrice(totalInterest)}
						/>

						<SummaryRow
							label='Custo efetivo total'
							value={`${LOAN_RATES.monthlyCet} % ao mês`}
							secondValue={`${LOAN_RATES.yearlyCet} % ao ano`}
						/>

						<SummaryRow
							label='% de juros ao mês'
							value={`% ${LOAN_RATES.monthlyInterest}`}
						/>

						<SummaryRow
							label='Valor total'
							value={formatPrice(selectedOption.totalValue)}
						/>

						<SummaryRow
							label='Valor das parcelas'
							value={formatPrice(selectedOption.installmentValue)}
						/>

						<SummaryRow
							label='Primeiro vencimento'
							value={formatDate(getFirstInstallmentDate())}
						/>

						<View className='flex items-center h-[39px]'>
							<Text className='text-sm font-semibold leading-5 tracking-[0.28px] text-[#0C0C0C]'>
								Dados para transferência
							</Text>
						</View>

						<SummaryRow
							label='Tipo de transferência'
							value='Depósito em conta'
						/>

						<SummaryRow
							label='Titular da conta'
							value={holder?.name ? holder.name.toUpperCase() : UNAVAILABLE}
						/>

						<SummaryRow
							label='CPF/CNPJ'
							value={holderDocument || UNAVAILABLE}
						/>

						<SummaryRow
							label='Instituição'
							value={bank ? `${bank.code} - ${bank.name.toUpperCase()}` : UNAVAILABLE}
						/>

						<SummaryRow
							label='Agência'
							value={agency || UNAVAILABLE}
						/>

						<SummaryRow
							label={accountTypeLabel || 'Conta'}
							value={accountNumber || UNAVAILABLE}
						/>
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

function SummaryRow(props) {
	const { label, value, secondValue } = props

	return (
		<View className='flex flex-col'>
			<Text className='text-[10px] leading-5 tracking-[0.2px] text-gray-700'>{label}</Text>

			<Text className='text-[10px] font-bold leading-5 tracking-[0.2px] text-gray-700'>{value}</Text>

			{secondValue && (
				<Text className='text-[10px] font-bold leading-5 tracking-[0.2px] text-gray-700'>{secondValue}</Text>
			)}
		</View>
	)
}
