import Eitri from 'eitri-bifrost'
import { Page, View, Text } from 'eitri-luminus'
import { BottomInset, CustomButton } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import iconCheck from '../assets/icons/icon-Check.svg'
import iconBar from '../assets/icons/icon-bar.svg'
import iconInfo from '../assets/icons/icon-info.svg'

export default function LoanCompleted() {
	const onBack = () => Eitri.navigation.back()

	const onPressMoreDetails = () => {}

	// TODO: definir destino (link/rota) do botão
	const onPressConfirm = () => {}

	return (
		<Page
			title='Empréstimo Concluído'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<View className='flex flex-col gap-[30px] px-4 pt-7 bg-snow'>
				<View className='flex items-end'>
					<View className='flex w-full bg-gradient-to-br from-red-500 to-red-700 h-2 rounded-[5px]' />
					<Image
						src={iconBar}
						alt=''
						className='w-6 h-6'
					/>
				</View>

				<View className='flex flex-col items-center gap-[10px]'>
					<Image
						src={iconCheck}
						alt=''
						className='w-[58px] h-[58px]'
					/>
					<Text className='text-lg font-semibold tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
						Tudo certo!
					</Text>
				</View>

				<View>
					<Text className='text-sm leading-5 text-[#555555]'>
						O empréstimo de R$ 275,00 será depositado via TED na sua conta informada até as 17h de hoje
					</Text>
				</View>

				<View className='flex flex-row items-center gap-[10px] bg-[#F5E8EB] rounded-lg p-[10px]'>
					<Image
						src={iconInfo}
						alt=''
						className='w-[22px] h-[22px]'
					/>
					<View className='flex flex-col gap-[5px]'>
						<Text className='text-[10px] leading-5 text-[#555555]'>
							O pagamento das parcelas é feito via boleto bancário, enviado todos mês no seu email
							cadastrado.
						</Text>
						<Text className='text-[10px] leading-5 text-[#555555]'>
							Após a contratação do EP iremos disponibilizar o primeiro boleto após 7 dias da contratação
							e os demais serão disponibilizados 12 dias antes do seu vencimento.
						</Text>
					</View>
				</View>

				<View className='flex flex-row justify-between items-center'>
					<Text className='text-sm font-semibold leading-5 text-[#0C0C0C]'>Dados do empréstimo</Text>
					<View onClick={onPressMoreDetails}>
						<Text className='text-[10px] leading-5 text-[#1A5FA8] underline'>Mais detalhes</Text>
					</View>
				</View>

				<View className='flex flex-col gap-[10px] p-[10px] rounded-lg bg-[#FAFAF8] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)]'>
					<View className='flex flex-col'>
						<Text className='text-[10px] leading-5 tracking-[0.2px] text-[#555555]'>
							Número do contrato
						</Text>
						<Text className='text-xs font-bold leading-5 tracking-[0.24px] text-[#555555]'>784755884</Text>
					</View>

					<View className='flex flex-col'>
						<Text className='text-[10px] leading-5 tracking-[0.2px] text-[#555555]'>Valor da parcela</Text>
						<Text className='text-xs font-bold leading-5 tracking-[0.24px] text-[#555555]'>R$ 41,15</Text>
					</View>

					<View className='flex flex-col'>
						<Text className='text-[10px] leading-5 tracking-[0.2px] text-[#555555]'>
							Data do primeiro vencimento
						</Text>
						<Text className='text-xs font-bold leading-5 tracking-[0.24px] text-[#555555]'>1008/2025</Text>
					</View>
				</View>

				<CustomButton
					label='Continuar'
					className='!h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressConfirm}
				/>
				<BottomInset />
			</View>
		</Page>
	)
}
