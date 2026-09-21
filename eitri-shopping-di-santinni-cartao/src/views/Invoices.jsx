import { useState, useEffect } from 'react'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton, Loading } from 'eitri-shopping-di-santinni-shared'
import Eitri from 'eitri-bifrost'
import CardHeader from '../components/CardHeader/CardHeader'
import InvoiceGauge from '../components/InvoiceGauge/InvoiceGauge'
import EyeIcon from '../assets/icons/eye-white.svg'
import LimitsIcon from '../assets/icons/limits.svg'
import CardsIcon from '../assets/icons/cards.svg'
import InvoicesIcon from '../assets/icons/invoices.svg'
import HelpIcon from '../assets/icons/help.svg'
import AddShortcutIcon from '../assets/icons/add-shortcut.svg'
import { getCardSummary } from '../services/CardService'
import { navigate, PAGES } from '../services/NavigationService'
import { formatPrice } from '../utils/utils'


const HIDDEN_VALUE = '●●●●●●●'
const HIDDEN_DATE = '●●/●●'
const HIDDEN_CARD_DIGITS = '●●●●'

// TODO: definir destino (link/rota) dos atalhos
const SHORTCUTS = [
	{ label: 'Limites', icon: LimitsIcon, onPress: () => navigate(PAGES.CARD_LIMIT) },
	{ label: 'Meus\nCartões', icon: CardsIcon, onPress: () => {} },
	{ label: 'Minhas\nFaturas', icon: InvoicesIcon, onPress: () => {} },
	{ label: 'Me Ajuda', icon: HelpIcon, onPress: () => {} },
	{ label: 'Adicionar\nAtalho', icon: AddShortcutIcon, onPress: () => {}, highlight: true }
]

export default function Invoices() {
	const [summary, setSummary] = useState(null)
	const [showValues, setShowValues] = useState(false)

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

	const toggleShowValues = () => setShowValues(!showValues)

	const displayPrice = value => (showValues ? formatPrice(value) : HIDDEN_VALUE)

	const displayValue = (value, hiddenMask) => (showValues ? value : hiddenMask)

	// TODO: definir destino (link/rota) dos botões
	const onPressSeeInvoices = () => {}

	const onPressSimulate = () => {}

	const onPressDoubleLimit = () => {}

	return (
		<Page
			title='Faturas - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={!summary}
				fullScreen={true}
			/>

			{summary && (
				<View className='flex flex-col bg-snow'>
					<View className='flex flex-col items-center px-4 pt-[19px] pb-[52px] rounded-b-[14px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] bg-gradient-to-r from-red-500 to-red-700'>
						<View
							className='flex justify-end w-full'
							onClick={toggleShowValues}>
							<View className='relative w-5 h-[13px]'>
								<Image
									src={EyeIcon}
									alt={showValues ? 'Esconder valores' : 'Mostrar valores'}
									className='w-5 h-[13px]'
								/>

								{showValues && (
									<View className='absolute top-1/2 left-[-2px] w-6 h-px bg-white rotate-[-35deg]' />
								)}
							</View>
						</View>

						<View className='flex items-start justify-between w-full mt-[17px]'>
							<View className='flex flex-col gap-4'>
								<Text className='text-lg font-semibold leading-6 tracking-[0.36px] text-white'>
									Olá, {summary.customerName}!
								</Text>

								<CardInfo
									label='Cartão Final:'
									value={displayValue(summary.cardLastDigits, HIDDEN_CARD_DIGITS)}
								/>
							</View>

							<View className='flex flex-col items-end gap-2'>
								<CardInfo
									label='Vencimento dia:'
									value={displayValue(summary.dueDate, HIDDEN_DATE)}
								/>
								<CardInfo
									label='Status:'
									value={summary.invoiceStatus}
								/>
								<CardInfo
									label='Melhor dia'
									value={displayValue(summary.bestPurchaseDay, HIDDEN_DATE)}
								/>
							</View>
						</View>

						<View className='mt-[17px]'>
							<InvoiceGauge
								invoice={summary.currentInvoice}
								availableLimit={summary.availableLimit}>
								<View className='absolute top-[41px] left-0 right-0 flex flex-col items-center'>
									<Text className='text-sm font-semibold leading-6 tracking-[0.28px] text-white'>
										Sua Fatura atual
									</Text>

									<Text className='mt-3 text-2xl font-bold leading-6 tracking-[0.48px] text-white'>
										{displayPrice(summary.currentInvoice)}
									</Text>

									<Text className='mt-6 text-xs font-semibold leading-6 tracking-[0.24px] text-white'>
										Limite disponível
									</Text>

									<Text className='text-xs font-semibold leading-6 tracking-[0.24px] text-white'>
										{displayPrice(summary.availableLimit)}
									</Text>
								</View>
							</InvoiceGauge>
						</View>

						<CustomButton
							backgroundColor='bg-white'
							className='!h-[34px] !w-[177px] mt-[37px]'
							onPress={onPressSeeInvoices}>
							<Text className='text-xs font-bold uppercase tracking-[0.24px] text-red-700'>Ver faturas</Text>
						</CustomButton>
					</View>

					<View className='relative z-10 flex justify-center gap-5 -mt-[23px]'>
						{SHORTCUTS.map(shortcut => (
							<View
								key={shortcut.label}
								className='flex flex-col items-center gap-2 w-[46px]'
								onClick={shortcut.onPress}>
								<View
									className={`flex items-center justify-center w-[46px] h-[46px] rounded-lg shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] ${shortcut.highlight ? 'bg-red-900' : 'bg-[#F8F9FA]'}`}>
									<Image
										src={shortcut.icon}
										alt=''
										className='w-6 h-6'
									/>
								</View>

								<Text className='text-[8px] font-semibold leading-[10px] tracking-[0.16px] text-center whitespace-pre-line text-[#434343]'>
									{shortcut.label}
								</Text>
							</View>
						))}
					</View>

					<View className='flex flex-col gap-[5px] px-4 mt-5'>
						<Text className='text-xs font-semibold leading-6 tracking-[0.24px] text-black'>Para você</Text>

						<View className='flex items-end justify-between px-6 py-8 rounded-lg bg-base-100 drop-shadow-[0px_4px_3px_rgba(0,0,0,0.25)]'>
							<View className='flex flex-col gap-[5px]'>
								<Text className='text-xs font-semibold leading-6 tracking-[0.24px] text-black'>
									Empréstimo pessoal
								</Text>

								<Text className='text-[10px] leading-6 tracking-[0.2px] text-[#8C8C8C]'>
									Valor disponível de até
								</Text>

								<Text
									className={`leading-6 text-black font-semibold ${showValues ? 'text-xs tracking-[0.24px]' : 'text-[6px] tracking-[3.24px]'}`}>
									{displayPrice(summary.personalLoanAvailable)}
								</Text>
							</View>

							<CustomButton
								className='!h-[25px] !w-[86px]'
								textClassName='!text-base-100 !font-semibold text-[10px] uppercase tracking-[0.2px]'
								label='Simular'
								onPress={onPressSimulate}
							/>
						</View>
					</View>

					<View
						className='flex justify-center px-10 mt-5'
						onClick={onPressDoubleLimit}>
						<Text className='text-xs leading-6 tracking-[0.24px] text-center text-black underline'>
							Compre em 12x fixas com a 1a em até 70 dias e dobre o seu limite para{' '} 
							{displayPrice(summary.doubledLimit)}
						</Text>
					</View>

					<BottomInset />
					<BottomInset />
				</View>
			)}
		</Page>
	)
}

function CardInfo(props) {
	const { label, value } = props

	return (
		<View className='flex items-start gap-1'>
			<Text className='text-[10px] font-semibold leading-5 tracking-[0.2px] text-base-100'>{label}</Text>
			<Text className='text-[10px] font-bold leading-5 tracking-[0.2px] text-base-100'>{value}</Text>
		</View>
	)
}
