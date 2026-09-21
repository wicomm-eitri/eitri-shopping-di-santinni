import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton, Loading } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import MonthSelector from '../components/MonthSelector/MonthSelector'
import ChevronDownIcon from '../assets/icons/chevron-down.svg'
import TransactionServiceIcon from '../assets/icons/transaction-service.svg'
import TransactionClothingIcon from '../assets/icons/transaction-clothing.svg'
import { getInvoice } from '../services/CardService'
import { formatPrice } from '../utils/utils'

const CURRENT_DATE = new Date()

const INVOICE_YEARS = [CURRENT_DATE.getFullYear() - 1, CURRENT_DATE.getFullYear()]

// TODO: definir destino (link/rota) dos serviços financeiros
const FINANCIAL_SERVICES = [
	{
		title: 'Saúde Di Santinni',
		price: 32.9,
		description: 'Mantenha-se saudável sem comprometer suas finanças',
		image: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/489757e5-bfa3-451e-9595-8e77f4ae1156___762cf25023eb6eb9fad4962d191c708f.png',
		onPress: () => {}
	},
	{
		title: 'Odonto Di Santinni',
		price: 27.9,
		description: 'Mantenha-se saudável sem comprometer suas finanças',
		image: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/d4ec16d3-ee17-4938-8f3d-e0f081593e7d___2eb0f68bb89cbfcc7527b6e39099aa5e.jpg',
		onPress: () => {}
	},
	{
		title: 'Seguro Di Santinni',
		price: 55.9,
		description: 'Mantenha a segurança com a Di Santinni',
		image: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/2f561cc8-2bb7-46df-a313-ec8d8a92d638___3b4474f435fe51a65e96ca90f4e45f72.png',
		onPress: () => {}
	},
	{
		title: 'Seguro Cartão Di Santinni',
		price: 18.9,
		description: 'Mantenha suas informações e compras protegidas',
		image: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/9801de73-c4a9-49e1-a825-a6284846a66d___0c97acf35b8039d2c4cd89100929429c.png',
		onPress: () => {}
	}
]

export default function MyInvoices() {
	const [selectedYear, setSelectedYear] = useState(CURRENT_DATE.getFullYear())
	const [selectedMonth, setSelectedMonth] = useState(CURRENT_DATE.getMonth())
	const [showYearOptions, setShowYearOptions] = useState(false)
	const [invoice, setInvoice] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadInvoice()
	}, [selectedYear, selectedMonth])

	const loadInvoice = async () => {
		setLoading(true)

		try {
			const data = await getInvoice(selectedYear, selectedMonth + 1)

			setInvoice(data)
		} catch (e) {
			console.error('loadInvoice error:', e)
		} finally {
			setLoading(false)
		}
	}

	const onBack = () => Eitri.navigation.back()

	const onSelectYear = year => {
		setSelectedYear(year)
		setShowYearOptions(false)
	}

	// TODO: definir destino (link/rota) dos botões
	const onPressPayInvoice = () => {}

	const onPressPayWithPix = () => {}

	const onPressInvoicePdf = () => {}

	return (
		<Page
			title='Minhas Faturas - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={loading}
				fullScreen={true}
			/>

			<View className='flex flex-col gap-5 px-4 pt-6 bg-snow'>
				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Minhas Faturas
				</Text>

				<View className='relative z-20 self-center'>
					<View
						className='flex items-center justify-between w-[81px] px-1 py-1.5 rounded bg-[#FAFAF8] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.25)]'
						onClick={() => setShowYearOptions(!showYearOptions)}>
						<View className='w-3 h-3' />

						<Text className='text-xs font-medium leading-[10px] tracking-[0.24px] text-[#8C8C8C]'>
							{selectedYear}
						</Text>

						<Image
							src={ChevronDownIcon}
							alt=''
							className={`w-3 h-3 transition-transform duration-300 ${showYearOptions ? 'rotate-180' : ''}`}
						/>
					</View>

					{showYearOptions && (
						<View className='absolute top-full left-0 flex flex-col w-full mt-1 rounded bg-[#FAFAF8] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)]'>
							{INVOICE_YEARS.map(year => (
								<View
									key={year}
									className='flex justify-center py-1.5'
									onClick={() => onSelectYear(year)}>
									<Text
										className={`text-xs leading-[10px] tracking-[0.24px] ${year === selectedYear ? 'font-semibold text-black' : 'font-medium text-[#8C8C8C]'}`}>
										{year}
									</Text>
								</View>
							))}
						</View>
					)}
				</View>

				<MonthSelector
					selectedMonth={selectedMonth}
					onChange={setSelectedMonth}
				/>

				{invoice && (
					<>
						<View className='flex flex-col gap-3 px-6 pt-8 pb-5 rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.25)]'>
							<Text className='text-xs font-semibold leading-6 tracking-[0.24px] text-[#8C8C8C]'>
								Fatura {invoice.status}
							</Text>

							<View className='flex items-start justify-between'>
								<InvoiceInfo
									label='Valor Total'
									value={formatPrice(invoice.totalValue)}
									valueClassName='text-2xl leading-5 tracking-[0.48px]'
								/>

								<InvoiceInfo
									label='Vencimento'
									value={invoice.dueDate}
								/>
							</View>

							<InvoiceInfo
								label='Parcelamento'
								value={`Até ${invoice.maxInstallments}x de ${formatPrice(invoice.installmentValue)}`}
							/>

							<View className='w-full h-px bg-[#CCCCCC]' />

							<View className='flex flex-col gap-[10px]'>
								<CustomButton
									label='Pagar fatura'
									className='!h-[34px] text-xs uppercase tracking-[0.24px]'
									onPress={onPressPayInvoice}
								/>

								<CustomButton
									outlined
									className='!h-[34px] !border-[#1A5FA8]'
									onPress={onPressPayWithPix}>
									<Text className='text-xs font-bold uppercase tracking-[0.24px] text-[#1A5FA8]'>
										Pagar via Pix
									</Text>
								</CustomButton>

								<CustomButton
									outlined
									className='!h-[34px] !border-0'
									onPress={onPressInvoicePdf}>
									<Text className='text-xs font-bold uppercase tracking-[0.24px] text-[#595959]'>
										Fatura em PDF
									</Text>
								</CustomButton>
							</View>
						</View>

						<View className='flex flex-col gap-[10px]'>
							<Text className='text-sm font-semibold leading-5 tracking-[0.28px] text-black'>
								Serviços financeiros
							</Text>

							<View className='grid grid-cols-2 gap-x-[7px] gap-y-5'>
								{FINANCIAL_SERVICES.map(service => (
									<FinancialServiceCard
										key={service.title}
										service={service}
									/>
								))}
							</View>
						</View>

						<View className='flex flex-col gap-[10px]'>
							<Text className='text-xs font-semibold leading-6 tracking-[0.24px] text-black'>
								Resumo de gastos
							</Text>

							{invoice.cardholders.map(cardholder => (
								<View
									key={cardholder.name}
									className='flex items-center justify-between'>
									<View className='flex items-center gap-[10px]'>
										<Text className='text-sm font-semibold leading-5 tracking-[0.28px] text-black'>
											{cardholder.name}
										</Text>

										{cardholder.isHolder && <CardholderBadge label='Titular' />}
									</View>

									<Text className='text-xs font-semibold leading-5 tracking-[0.24px] text-right text-black'>
										{formatPrice(cardholder.totalValue)}
									</Text>
								</View>
							))}
						</View>

						<View className='w-full h-px bg-[#CCCCCC]' />

						<View className='flex flex-col gap-3'>
							<Text className='text-xs font-semibold leading-6 tracking-[0.24px] text-black'>Para você</Text>

							{invoice.transactions.map(transaction => (
								<View
									key={transaction.id}
									className='flex items-center justify-between'>
									<View className='flex items-center gap-[7px]'>
										<TransactionIcon type={transaction.type} />

										<View className='flex flex-col items-start justify-between h-[69px]'>
											<CardholderBadge label={transaction.cardholder} />

											<Text className='text-xs leading-5 tracking-[0.24px] text-black'>
												{transaction.description}
											</Text>

											<Text className='text-xs leading-6 tracking-[0.24px] text-[#8C8C8C]'>
												{transaction.date}
											</Text>
										</View>
									</View>

									<Text className='text-xs font-semibold leading-5 tracking-[0.24px] text-right text-black'>
										{formatPrice(transaction.value)}
									</Text>
								</View>
							))}
						</View>
					</>
				)}

				<BottomInset />
			</View>
		</Page>
	)
}

function InvoiceInfo(props) {
	const { label, value, valueClassName = 'text-sm leading-[10px] tracking-[0.28px]' } = props

	return (
		<View className='flex flex-col gap-3'>
			<Text className='text-xs leading-6 tracking-[0.24px] text-[#8C8C8C]'>{label}</Text>
			<Text className={`font-semibold text-black ${valueClassName}`}>{value}</Text>
		</View>
	)
}

function CardholderBadge(props) {
	const { label } = props

	return (
		<View className='flex items-center h-[17px] px-1.5 rounded-[5px] border border-[#888888]'>
			<Text className='text-[8px] font-semibold tracking-[0.16px] uppercase text-[#8C8C8C]'>{label}</Text>
		</View>
	)
}

function FinancialServiceCard(props) {
	const { service } = props

	return (
		<View
			className='flex flex-col gap-3'
			onClick={service.onPress}>
			<View className='w-full h-[86px] overflow-hidden rounded-lg bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'>
				<Image
					src={service.image}
					alt={service.title}
					className='w-full h-full object-cover'
				/>
			</View>

			<View className='flex flex-col gap-[10px]'>
				<Text className='text-xs font-semibold leading-6 tracking-[0.24px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{service.title}
				</Text>

				<Text className='text-[10px] leading-5 tracking-[0.2px] text-black'>
					A partir de {formatPrice(service.price)}/Mês
				</Text>

				<View className='w-full h-px bg-[#BFBFBF]' />

				<Text className='text-[10px] leading-3 tracking-[0.2px] text-black'>{service.description}</Text>
			</View>
		</View>
	)
}

function TransactionIcon(props) {
	const { type } = props

	if (type === 'service') {
		return (
			<View className='relative shrink-0 w-[66px] h-[69px]'>
				<Image
					src={TransactionServiceIcon}
					alt=''
					className='absolute -left-[6px] -top-[2px] w-[78px] h-[81px] max-w-none'
				/>
			</View>
		)
	}

	return (
		<View className='flex items-center justify-center shrink-0 w-[66px] h-[69px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
			<Image
				src={TransactionClothingIcon}
				alt=''
				className='w-6 h-6'
			/>
		</View>
	)
}
