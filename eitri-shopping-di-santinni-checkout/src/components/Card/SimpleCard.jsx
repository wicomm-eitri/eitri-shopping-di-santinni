import { useTranslation } from 'eitri-i18n'
import editIcon from '../../assets/icons/EditCheckout.svg'

export default function SimpleCard(props) {
	const { isFilled, title, subtitle, onPress, children, icon, mainActionLabel, ...rest } = props

	const { t } = useTranslation()

	return (
		<View className='w-full flex flex-col gap-3'>
			{title && <Text className='text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider'>{title}</Text>}
			<View className='bg-white rounded border border-gray-300 p-4 flex flex-col relative w-full'>
				<View className='w-full'>{children}</View>

				<View
					onClick={onPress}
					className='absolute top-1/2 -translate-y-1/2 right-4 z-10'>
					<Image src={editIcon} width="24px" height="24px" />
				</View>
			</View>
		</View>
	)
}
