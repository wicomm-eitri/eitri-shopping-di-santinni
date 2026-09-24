import RadioCheckedIcon from '../../assets/icons/radio-checked.svg'

export default function BoxRadioOption(props) {
	const { label, selected, onPress } = props

	return (
		<View
			className='flex flex-row items-center flex-1 gap-[10px] py-[14px] px-4 rounded bg-white border border-gray-200'
			onClick={onPress}>
			{selected ? (
				<Image
					src={RadioCheckedIcon}
					alt=''
					className='w-4 h-4'
				/>
			) : (
				<View className='w-4 h-4 rounded-full bg-white border border-[#E23D58]' />
			)}

			<Text className={`text-sm leading-5 tracking-[0.24px] text-[#2C2C2C] ${selected ? 'font-semibold' : ''}`}>
				{label}
			</Text>
		</View>
	)
}
