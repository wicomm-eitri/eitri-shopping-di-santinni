import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text } from 'eitri-luminus'
import { BottomInset, CustomButton } from 'eitri-shopping-di-santinni-shared'
import CardCheckbox from '../components/CardCheckbox/CardCheckbox'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import { navigate, PAGES } from '../services/NavigationService'

export default function LoanTerms(props) {
	const loan = props?.location?.state?.loan || {}

	const [acceptedTerms, setAcceptedTerms] = useState(false)

	const onBack = () => Eitri.navigation.back()

	// TODO: definir destino (link/documento) das cláusulas da CCB
	const onPressReadTerms = () => {}

	// TODO: enviar a contratação do empréstimo para a API antes de seguir
	const onPressConfirm = () => navigate(PAGES.LOAN_BIOMETRICS, { loan })

	return (
		<Page
			title='Termos e condições - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress currentStep={7} />

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Termos e Condições
				</Text>

				<View
					className='flex items-center gap-[10px] min-h-[71px] px-[10px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'
					onClick={() => setAcceptedTerms(!acceptedTerms)}>
					<CardCheckbox
						checked={acceptedTerms}
						onChange={setAcceptedTerms}
					/>

					<Text className='text-xs leading-5 tracking-[0.24px] text-[#0C0C0C]'>
						Compreendi e concordo com as cláusulas de cédula de Crédito Bancário (CCB)
					</Text>
				</View>

				<View onClick={onPressReadTerms}>
					<Text className='text-xs leading-5 tracking-[0.24px] text-[#1A5FA8] underline'>
						Ler as cláusulas da CCB
					</Text>
				</View>

				<CustomButton
					label='Confirmar'
					disabled={!acceptedTerms}
					className='!h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressConfirm}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}
