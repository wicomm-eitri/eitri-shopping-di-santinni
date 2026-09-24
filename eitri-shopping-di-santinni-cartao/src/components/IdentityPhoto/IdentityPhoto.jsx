import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton } from 'eitri-shopping-di-santinni-shared'
import FaceFrameIcon from '../../assets/icons/face-frame.svg'
import LoanProgress from '../LoanProgress/LoanProgress'
import PhotoTip from './components/PhotoTip'

const PHOTO_TIPS = [
	{ id: 'accessories', title: 'Remova acessórios', description: 'Boné, brinco ou quaisquer outros' },
	{ id: 'noSmile', title: 'Não sorria', description: 'Mantenha-se sério' },
	{ id: 'example', title: 'Siga o exemplo', description: 'Enquadre o rosto na moldura' }
]

export default function IdentityPhoto(props) {
	const { currentStep, totalSteps, buttonLabel, loading, onPressAction } = props

	const { t } = useTranslation()

	return (
		<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
			<LoanProgress
				currentStep={currentStep}
				totalSteps={totalSteps}
			/>

			<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
				{t('identityPhoto.title', 'Confirmar identidade')}
			</Text>

			<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
				{t('identityPhoto.subtitle', 'Tire uma foto para confirmar sua identidade')}
			</Text>

			<View className='flex flex-col items-center justify-center'>
				<Image
					src={FaceFrameIcon}
					alt=''
					className='w-[153px] h-[153px]'
				/>
			</View>

			<View className='flex flex-col gap-3'>
				{PHOTO_TIPS.map((tip, index) => (
					<PhotoTip
						key={tip.id}
						number={index + 1}
						title={t(`identityPhoto.tips.${tip.id}.title`, tip.title)}
						description={t(`identityPhoto.tips.${tip.id}.description`, tip.description)}
					/>
				))}
			</View>

			<CustomButton
				label={buttonLabel}
				disabled={loading}
				className='!h-[34px] text-xs uppercase tracking-[0.24px]'
				onPress={onPressAction}
			/>

			<BottomInset />
		</View>
	)
}
