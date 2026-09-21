import { useState, useEffect } from 'react'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton, Loading } from 'eitri-shopping-di-santinni-shared'
import Eitri from 'eitri-bifrost'
import CardHeader from '../components/CardHeader/CardHeader'
import SimulationIcon from '../assets/icons/loan-simulation.svg'
import MoneyIcon from '../assets/icons/loan-money.svg'
import PhoneIcon from '../assets/icons/loan-phone.svg'
import { getCardSummary } from '../services/CardService'
import { formatPrice } from '../utils/utils'
import { navigate, PAGES } from '../services/NavigationService'

const LOAN_BANNER =
	'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/0c0cf3ac-0d6d-449e-a916-0c6a7fa90647___6b35571212d26b27e22da7b1667e1da2.png'

const LOAN_ADVANTAGES = [
	{
		title: 'Simulação sem compromisso',
		description: 'Simule as condições do empréstimo e escolha a melhor opção para você.',
		icon: SimulationIcon,
		iconClassName: 'w-[26px] h-[26px]'
	},
	{
		title: 'Receba na hora o valor na conta',
		description: 'Receba o valor pela sua conta sem precisar esperar para usar.',
		icon: MoneyIcon,
		iconClassName: 'w-6 h-6'
	},
	{
		title: 'Praticidade no Pagamento',
		description: 'Pague suas parcelas através do boleto no seu aplicativo',
		icon: PhoneIcon,
		iconClassName: 'w-[17px] h-[26px]'
	}
]

export default function Loan() {
	const [summary, setSummary] = useState(null)

	useEffect(() => {
		loadSummary()
	}, [])

	const loadSummary = async () => {
		try {
			const data = await getCardSummary()

			setSummary(data)
		} catch (e) {
			console.error('loadSummary error:', e)
		}
	}

	const onBack = () => Eitri.navigation.back()

	const onPressSimulate = () => navigate(PAGES.LOAN_AMOUNT, { preApprovedAmount: summary.personalLoanAvailable })

	return (
		<Page
			title='Empréstimo - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={!summary}
				fullScreen={true}
			/>

			{summary && (
				<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
					<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
						Empréstimo
					</Text>

					<Image
						src={LOAN_BANNER}
						alt='Empréstimo Di Santinni'
						className='w-full h-auto rounded-lg'
					/>

					<View className='flex flex-col gap-3'>
						<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
							Precisando de uma ajuda financeira?
						</Text>

						<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
							Contrate o valor que precisa e parcele em até 12x fixas
						</Text>
					</View>

					<Text className='text-sm font-semibold leading-5 tracking-[0.28px] text-black'>
						Vantagens de contratar o Empréstimo
					</Text>

					<View className='w-full h-px bg-[#CCCCCC]' />

					<View className='flex flex-col gap-3'>
						{LOAN_ADVANTAGES.map(advantage => (
							<View
								key={advantage.title}
								className='flex items-start gap-[7px]'>
								<View className='flex justify-center shrink-0 w-[66px] pt-[7px]'>
									<Image
										src={advantage.icon}
										alt=''
										className={advantage.iconClassName}
									/>
								</View>

								<View className='flex flex-col gap-1 min-h-[69px]'>
									<Text className='text-xs font-semibold leading-5 tracking-[0.24px] text-black'>
										{advantage.title}
									</Text>

									<Text className='text-xs leading-5 tracking-[0.24px] text-black'>
										{advantage.description}
									</Text>
								</View>
							</View>
						))}
					</View>

					<View className='flex flex-col gap-[15px]'>
						<View className='flex items-center justify-between'>
							<Text className='text-xs font-semibold leading-5 tracking-[0.24px] text-black'>
								Valor pré aprovado
							</Text>

							<Text className='text-sm font-semibold leading-5 tracking-[0.28px] text-right text-black'>
								{formatPrice(summary.personalLoanAvailable)}
							</Text>
						</View>

						<CustomButton
							label='Simular'
							className='!h-[34px] text-xs uppercase tracking-[0.24px]'
							onPress={onPressSimulate}
						/>
					</View>

					<BottomInset />
				</View>
			)}
		</Page>
	)
}
