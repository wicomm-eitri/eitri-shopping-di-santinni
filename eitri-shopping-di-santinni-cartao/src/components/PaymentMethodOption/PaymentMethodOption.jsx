import ChevronIcon from '../../assets/icons/chevron-left.svg'

export default function PaymentMethodOption(props) {
	const { icon, title, subtitle, onPress } = props

	return (
		<View
			className='flex flex-row items-center justify-between h-16 pr-[10px] rounded-lg bg-[#FAFAF8] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)]'
			onClick={onPress}>
			<View className='flex flex-row items-center'>
				<View className='flex items-center justify-center w-[66px] h-11'>
					<Image
						src={icon}
						alt=''
						className='w-6 h-6'
					/>
				</View>

				<View className='flex flex-col gap-1'>
					<Text className='text-xs font-semibold text-[#0C0C0C]'>{title}</Text>
					<Text className='text-[10px] text-[#8C8C8C]'>{subtitle}</Text>
				</View>
			</View>

			<Image
				src={ChevronIcon}
				alt=''
				className='w-5 h-5 rotate-180'
			/>
		</View>
	)
}
