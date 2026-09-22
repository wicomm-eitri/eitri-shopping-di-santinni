import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, Loading } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import { getLoanInstallments } from '../services/CardService'
import { navigate, PAGES } from '../services/NavigationService'
import ChevronIcon from '../assets/icons/chevron-left.svg'
import { formatPrice } from '../utils/utils'

export default function LoanInstallments(props) {
	const amount = props?.location?.state?.amount || 0

	const [installmentOptions, setInstallmentOptions] = useState(null)

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

	const onBack = () => Eitri.navigation.back()

	const onPressOption = option => navigate(PAGES.LOAN_DETAILS, { amount, installments: option.installments })

	return (
		<Page
			title='Parcelas - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={!installmentOptions}
				fullScreen={true}
			/>

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress currentStep={2} />

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Escolha como quer pagar
				</Text>

				{installmentOptions && (
					<View className='flex flex-col gap-[10px]'>
						{installmentOptions.map(option => (
							<View
								key={option.installments}
								className='flex items-center justify-between h-16 px-[10px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)] active:opacity-80'
								onClick={() => onPressOption(option)}>
								<View className='flex flex-col gap-1'>
									<Text className='text-xs font-semibold leading-5 tracking-[0.24px] text-black'>
										{option.installments} {option.installments === 1 ? 'parcela' : 'parcelas'} de{' '}
										{formatPrice(option.installmentValue)}
									</Text>

									<Text className='text-xs leading-5 tracking-[0.24px] text-[#888888]'>
										Total a pagar de {formatPrice(option.totalValue)}
									</Text>
								</View>

								<Image
									src={ChevronIcon}
									alt=''
									className='w-5 h-5 rotate-180'
								/>
							</View>
						))}
					</View>
				)}

				<BottomInset />
			</View>
		</Page>
	)
}
