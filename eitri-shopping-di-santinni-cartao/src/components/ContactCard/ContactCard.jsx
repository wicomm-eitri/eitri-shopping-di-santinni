import { useTranslation } from 'eitri-i18n'
import { View, Text, Image } from 'eitri-luminus'
import PhoneForwardIcon from '../../assets/icons/phone-forward.svg'

export default function ContactCard(props) {
	const { contact, onPress } = props

	const { t } = useTranslation()

	return (
		<View
			className='flex flex-row items-center gap-[7px] p-[10px] rounded-lg bg-[#F8F9FA] shadow-[-4px_4px_2px_0_rgba(0,0,0,0.2)] active:opacity-80'
			onClick={onPress}>
			<View className='flex items-center justify-center w-[66px] h-[43px]'>
				<Image
					src={PhoneForwardIcon}
					alt=''
					className='w-6 h-6'
				/>
			</View>

			<View className='flex flex-col gap-1 flex-1'>
				<Text className='text-xs font-semibold text-[#0C0C0C]'>
					{t(`help.contacts.${contact.id}.title`, contact.title)}
				</Text>

				<Text className='text-sm font-semibold text-[#555555]'>{contact.phone}</Text>

				<Text className='text-xs text-[#8C8C8C]'>
					{t(`help.contacts.${contact.id}.description`, contact.description)}
				</Text>
			</View>
		</View>
	)
}
