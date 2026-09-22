import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton, Loading } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import { getFirstInstallmentDate, getLoanContract } from '../services/CardService'
import InfoGrayIcon from '../assets/icons/info-gray.svg'
import SuccessCheckIcon from '../assets/icons/success-check.svg'
import { formatDate, formatPrice } from '../utils/utils'

const UNAVAILABLE = 'Não informado'

const PAYMENT_INFO = [
	'O pagamento das parcelas é feito via boleto bancário, enviado todos mês no seu email cadastrado.',
	'Após a contratação do EP iremos disponibilizar o primeiro boleto após 7 dias da contratação e os demais serão disponibilizados 12 dias antes do seu vencimento.'
]

export default function LoanCompleted(props) {
	const loan = props?.location?.state?.loan || {}

	const amount = loan.amount || 0
	const installmentValue = loan.installmentValue || 0

	const [contract, setContract] = useState(null)

	useEffect(() => {
		loadContract()
	}, [])

	const loadContract = async () => {
		try {
			const data = await getLoanContract()

			setContract(data)
		} catch (e) {
			console.error('loadContract error:', e)
			setContract({})
		}
	}

	const onBack = () => Eitri.navigation.back()

	// TODO: definir destino (link/rota) dos detalhes do empréstimo
	const onPressMoreDetails = () => {}

	// TODO: definir destino (link/rota) do botão continuar
	const onPressContinue = () => {}

	return (
		<Page
			title='Empréstimo concluído - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={!contract}
				fullScreen={true}
			/>

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress
					currentStep={10}
					completed
				/>

				<View className='flex flex-col items-center justify-center gap-[10px]'>
					<Image
						src={SuccessCheckIcon}
						alt=''
						className='w-[58px] h-[58px]'
					/>

					<Text className='text-lg font-semibold leading-6 tracking-[0.36px] text-center bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
						Tudo certo!
					</Text>
				</View>

				<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
					O empréstimo de {formatPrice(amount)} será depositado via TED na sua conta informada até as 17h de
					hoje
				</Text>

				<View className='flex items-center gap-[10px] p-[10px] rounded-lg bg-[#F5E8EB] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
					<Image
						src={InfoGrayIcon}
						alt=''
						className='shrink-0 w-[22px] h-[22px]'
					/>

					<View className='flex flex-col gap-5'>
						{PAYMENT_INFO.map(info => (
							<Text
								key={info}
								className='text-[10px] leading-5 tracking-[0.2px] text-gray-700'>
								{info}
							</Text>
						))}
					</View>
				</View>

				<View className='flex items-center justify-between'>
					<Text className='text-sm font-semibold leading-5 tracking-[0.28px] text-[#0C0C0C]'>
						Dados do empréstimo
					</Text>

					<View onClick={onPressMoreDetails}>
						<Text className='text-[10px] leading-5 tracking-[0.2px] text-right text-[#1A5FA8] underline'>
							Mais detalhes
						</Text>
					</View>
				</View>

				{contract && (
					<View className='flex flex-col gap-[10px] p-[10px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
						<ContractInfo
							label='Número do contrato'
							value={contract.number || UNAVAILABLE}
						/>

						<ContractInfo
							label='Valor da parcela'
							value={installmentValue ? formatPrice(installmentValue) : UNAVAILABLE}
						/>

						<ContractInfo
							label='Data do primeiro vencimento'
							value={formatDate(getFirstInstallmentDate()) || UNAVAILABLE}
						/>
					</View>
				)}

				<CustomButton
					label='Continuar'
					className='!h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressContinue}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}

function ContractInfo(props) {
	const { label, value } = props

	return (
		<View className='flex flex-col'>
			<Text className='text-[10px] leading-5 tracking-[0.2px] text-gray-700'>{label}</Text>

			<Text className='text-xs font-bold leading-5 tracking-[0.2px] text-gray-700'>{value}</Text>
		</View>
	)
}
