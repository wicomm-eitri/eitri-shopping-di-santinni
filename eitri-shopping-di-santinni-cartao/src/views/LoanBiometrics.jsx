import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import { navigate, PAGES } from '../services/NavigationService'
import FaceCameraIcon from '../assets/icons/face-camera.svg'

export default function LoanBiometrics(props) {
	const loan = props?.location?.state?.loan || {}

	const onBack = () => Eitri.navigation.back()

	const onPressAgree = () => navigate(PAGES.LOAN_IDENTITY, { loan })

	return (
		<Page
			title='Reconhecimento facial - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress currentStep={8} />

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Reconhecimento Facial
				</Text>

				<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
					Vamos confirmar sua identidade com uma foto
				</Text>

				<View className='flex flex-col items-center justify-center gap-[15px]'>
					<Image
						src={FaceCameraIcon}
						alt=''
						className='w-[113px] h-[113px]'
					/>

					<Text className='text-lg font-semibold leading-6 tracking-[0.36px] text-center bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
						Atenção
					</Text>
				</View>

				<Text className='text-sm leading-5 tracking-[0.28px] text-center text-gray-700'>
					Utilizaremos a Biometria para proteger os dados do nosso cliente e evitar qualquer tipo de fraude.
				</Text>

				<CustomButton
					label='Li e concordo'
					className='!h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressAgree}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}
