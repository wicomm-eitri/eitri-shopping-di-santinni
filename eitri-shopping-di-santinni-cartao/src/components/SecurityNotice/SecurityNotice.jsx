import { useTranslation } from 'eitri-i18n'
import { CustomButton } from 'eitri-shopping-di-santinni-shared'
import CloseIcon from '../../assets/icons/close.svg'
import WarningIcon from '../../assets/icons/warning.svg'
import BottomSheet from '../BottomSheet/BottomSheet'

export default function SecurityNotice(props) {
	const { show, onClose, onPressAgree } = props

	const { t } = useTranslation()

	const handleClose = () => {
		if (typeof onClose === 'function') onClose()
	}

	const handleAgree = () => {
		if (typeof onPressAgree === 'function') onPressAgree()
	}

	return (
		<BottomSheet
			show={show}
			onClose={handleClose}>
			<View className='flex flex-col items-center px-4 pt-5 pb-[20.5px]'>
				<View className='flex w-full justify-end'>
					<View
						onClick={handleClose}
						className='flex items-center justify-center'>
						<Image
							src={CloseIcon}
							alt=''
							className='w-6 h-6'
						/>
					</View>
				</View>

				<Image
					src={WarningIcon}
					alt=''
					className='w-14 h-14 mt-1'
				/>

				<Text className='mt-5 text-xl font-semibold uppercase leading-5 tracking-[2%] text-center text-[#C8102E]'>
					{t('securityNotice.title', 'Segurança')}
				</Text>

				<Text className='mt-5 text-sm leading-5 tracking-[2%] text-center text-neutral-500'>
					{t(
						'securityNotice.description',
						'Para sua segurança solicitaremos acesso a sua localização e informações do seu dispositivo.'
					)}
				</Text>

				<CustomButton
					label={t('securityNotice.agree', 'Concordar')}
					backgroundColor='!bg-[#C8102E]'
					className='mt-5'
					textClassName='!text-sm !font-bold uppercase !tracking-[2%]'
					onPress={handleAgree}
				/>
			</View>
		</BottomSheet>
	)
}
