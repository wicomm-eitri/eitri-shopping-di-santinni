import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton, CustomInput, Loading } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import { getBanks } from '../services/CardService'
import ChevronIcon from '../assets/icons/chevron-left.svg'
import SearchIcon from '../assets/icons/search.svg'

export default function LoanBank(props) {
	const amount = props?.location?.state?.amount || 0
	const installments = props?.location?.state?.installments || 0

	const [banks, setBanks] = useState(null)
	const [search, setSearch] = useState('')
	const [selectedBank, setSelectedBank] = useState(null)

	useEffect(() => {
		loadBanks()
	}, [])

	const loadBanks = async () => {
		try {
			const data = await getBanks()

			setBanks(data)
		} catch (e) {
			console.error('loadBanks error:', e)
		}
	}

	const filteredBanks = (banks || []).filter(bank => {
		const term = search.trim().toLowerCase()

		return !term || bank.name.toLowerCase().includes(term) || bank.code.includes(term)
	})

	const onBack = () => Eitri.navigation.back()

	const onChangeSearch = e => setSearch(e.target ? e.target.value : e)

	// TODO: definir próxima fase do empréstimo, enviando conta e parcelamento escolhidos
	const onPressContinue = () => {}

	return (
		<Page
			title='Dados da conta - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={!banks}
				fullScreen={true}
			/>

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress currentStep={4} />

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Informe os dados da conta
				</Text>

				<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>Selecione a instituição</Text>

				<View className='flex items-center gap-2 w-full h-11 px-4 rounded bg-white border border-[#D4D4D4]'>
					<View className='flex-1'>
						<CustomInput
							value={search}
							placeholder='Buscar Banco'
							onChange={onChangeSearch}
							className='!h-10 !p-0 !border-0 !bg-transparent text-sm text-black tracking-[0.28px]'
						/>
					</View>

					<Image
						src={SearchIcon}
						alt=''
						className='shrink-0 w-[14px] h-[14px]'
					/>
				</View>

				{banks && (
					<View className='flex flex-col gap-[10px]'>
						{filteredBanks.map(bank => {
							const isSelected = selectedBank?.code === bank.code

							return (
								<View
									key={bank.code}
									className={`flex items-center justify-between h-[50px] px-[10px] rounded-lg border bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)] ${isSelected ? 'border-red-700' : 'border-transparent'}`}
									onClick={() => setSelectedBank(bank)}>
									<View className='flex items-center gap-5'>
										<Text className='text-xs font-semibold leading-5 tracking-[0.24px] text-[#0C0C0C]'>
											{bank.code}
										</Text>

										<Text className='text-xs leading-5 tracking-[0.24px] text-[#888888]'>
											{bank.name}
										</Text>
									</View>

									<Image
										src={ChevronIcon}
										alt=''
										className='w-5 h-5 rotate-180'
									/>
								</View>
							)
						})}

						{filteredBanks.length === 0 && (
							<Text className='text-xs leading-5 tracking-[0.24px] text-[#888888]'>
								Nenhuma instituição encontrada
							</Text>
						)}
					</View>
				)}

				<CustomButton
					label='Continuar'
					disabled={!selectedBank}
					className='!h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressContinue}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}
