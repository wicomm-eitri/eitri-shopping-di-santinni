import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton } from 'eitri-shopping-di-santinni-shared'
import FaceCameraIcon from '../../assets/icons/face-camera.svg'
import LoanProgress from '../LoanProgress/LoanProgress'

export default function BiometricsNotice(props) {
	const { currentStep, totalSteps, onPressAgree } = props

	const { t } = useTranslation()

	return (
		<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
			<LoanProgress
				currentStep={currentStep}
				totalSteps={totalSteps}
			/>

			<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
				{t('biometricsNotice.title', 'Reconhecimento Facial')}
			</Text>

			<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
				{t('biometricsNotice.subtitle', 'Vamos confirmar sua identidade com uma foto')}
			</Text>

			<View className='flex flex-col items-center justify-center gap-[15px]'>
				<Image
					src={FaceCameraIcon}
					alt=''
					className='w-[113px] h-[113px]'
				/>

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] text-center bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('biometricsNotice.attention', 'Atenção')}
				</Text>
			</View>

			<Text className='text-sm leading-5 tracking-[0.28px] text-center text-gray-700'>
				{t(
					'biometricsNotice.description',
					'Utilizaremos a Biometria para proteger os dados do nosso cliente e evitar qualquer tipo de fraude.'
				)}
			</Text>

			<CustomButton
				label={t('biometricsNotice.agree', 'Li e concordo')}
				className='!h-[34px] text-xs uppercase tracking-[0.24px]'
				onPress={onPressAgree}
			/>

			<BottomInset />
		</View>
	)
}
