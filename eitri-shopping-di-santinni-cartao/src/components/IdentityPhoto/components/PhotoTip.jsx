export default function PhotoTip(props) {
	const { number, title, description } = props

	return (
		<View className='flex items-center gap-[15px]'>
			<View className='flex items-center justify-center shrink-0 w-[42px] h-11 rounded-full bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] text-center bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent'>
					{number}
				</Text>
			</View>

			<View className='flex flex-col gap-1'>
				<Text className='text-xs font-semibold leading-5 tracking-[0.24px] text-[#0C0C0C]'>{title}</Text>

				<Text className='text-xs leading-5 tracking-[0.24px] text-[#0C0C0C]'>{description}</Text>
			</View>
		</View>
	)
}
