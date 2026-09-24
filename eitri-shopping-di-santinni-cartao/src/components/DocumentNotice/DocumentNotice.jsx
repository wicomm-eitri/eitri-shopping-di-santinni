import { useTranslation } from 'eitri-i18n'
import { CustomButton } from 'eitri-shopping-di-santinni-shared'
import CardLockIcon from '../../assets/icons/card-lock.svg'
import CloseIcon from '../../assets/icons/close.svg'
import BottomSheet from '../BottomSheet/BottomSheet'

export default function DocumentNotice(props) {
	const { show, onClose, onPressContinue } = props

	const { t } = useTranslation()

	const handleClose = () => {
		if (typeof onClose === 'function') onClose()
	}

	const handleContinue = () => {
		if (typeof onPressContinue === 'function') onPressContinue()
	}

	return (
		<BottomSheet
			show={show}
			onClose={handleClose}>
			<View className='flex flex-col px-4 pt-5 pb-[20.5px]'>
				<View className='flex w-full items-center justify-between'>
					<Text className='text-xl font-semibold leading-5 tracking-[2%] text-[#C8102E]'>
						{t('documentNotice.title', 'Atenção')}
					</Text>

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

				<Text className='mt-5 text-sm leading-5 tracking-[2%] text-neutral-500'>
					{t('documentNotice.descriptionPrefix', 'Tenha em mãos seu documento de')}{' '}
					<Text className='text-sm font-semibold text-neutral-700'>{t('documentNotice.rg', 'RG')}</Text>{' '}
					{t('documentNotice.or', 'ou')}{' '}
					<Text className='text-sm font-semibold text-neutral-700'>{t('documentNotice.cnh', 'CNH')}</Text>
				</Text>

				<View className='flex justify-center w-full mt-5'>
					<Image
						src={CardLockIcon}
						alt=''
						className='w-[83px] h-[83px]'
					/>
				</View>

				<CustomButton
					label={t('documentNotice.continue', 'Continuar')}
					backgroundColor='!bg-[#C8102E]'
					className='mt-5'
					textClassName='!text-sm !font-bold uppercase !tracking-[2%]'
					onPress={handleContinue}
				/>
			</View>
		</BottomSheet>
	)
}
