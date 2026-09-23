export default function ShortcutCard(props) {
	const { icon, label, onPress } = props

	return (
		<View
			className='flex flex-col items-center justify-center shrink-0 gap-[10px] w-[70px] h-[70px] px-1 py-2 rounded-lg bg-[#F8F9FA] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)]'
			onClick={onPress}>
			<Image
				src={icon}
				alt=''
				className='w-6 h-6'
			/>

			<Text className='text-[8px] font-semibold leading-[10px] tracking-[0.16px] text-center whitespace-pre-line text-[#434343]'>
				{label}
			</Text>
		</View>
	)
}
