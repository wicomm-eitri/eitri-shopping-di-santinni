export default function LoanField(props) {
	const { label, value } = props

	return (
		<View className='flex flex-col gap-1'>
			<Text className='text-xs text-[#8C8C8C]'>{label}</Text>
			<Text className='text-sm font-semibold text-black'>{value}</Text>
		</View>
	)
}
