const STATUS_CLASSES = {
	onTime: 'bg-[#1A7F4B] text-white',
	canceled: 'border border-[#C8102E] text-[#C8102E]'
}

const STATUS_LABELS = {
	onTime: 'Em dia',
	canceled: 'Cancelado'
}

export default function LoanStatusBadge(props) {
	const { status } = props

	return (
		<View className={`flex items-center h-[15px] px-[10px] rounded-[4px] ${STATUS_CLASSES[status]}`}>
			<Text className='text-[8px] font-semibold uppercase tracking-[0.16px]'>{STATUS_LABELS[status]}</Text>
		</View>
	)
}
