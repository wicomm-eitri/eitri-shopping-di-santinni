import { useTranslation } from 'eitri-i18n'
import { CustomButton } from 'eitri-shopping-di-santinni-shared'
import CardWarningIcon from '../../assets/icons/card-warning.svg'
import BottomSheet from '../BottomSheet/BottomSheet'

export default function CancelRegisterModal(props) {
	const { show, onCancel, onContinue } = props

	const { t } = useTranslation()

	return (
		<BottomSheet
			show={show}
			className='bg-[#FAFAF8]'
			onClose={onContinue}>
			<View className='flex flex-col items-center gap-[30px] pb-4'>
				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] text-center bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('cancelRegister.title', 'Deseja cancelar o cadastro?')}
				</Text>

				<Image
					src={CardWarningIcon}
					alt=''
					className='w-[83px] h-[83px]'
				/>

				<View className='flex flex-row gap-5 w-full'>
					<CustomButton
						outlined
						className='flex-1 !h-[34px] !bg-white !border-[#C8102E]'
						onPress={onCancel}>
						<Text className='text-xs font-bold uppercase tracking-[0.24px] text-[#C8102E]'>
							{t('cancelRegister.cancel', 'Cancelar')}
						</Text>
					</CustomButton>

					<CustomButton
						label={t('cancelRegister.continue', 'Continuar')}
						backgroundColor='bg-[#C8102E]'
						className='flex-1 !h-[34px]'
						textClassName='text-xs uppercase tracking-[0.24px]'
						onPress={onContinue}
					/>
				</View>
			</View>
		</BottomSheet>
	)
}
