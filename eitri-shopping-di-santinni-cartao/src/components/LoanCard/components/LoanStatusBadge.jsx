import { useTranslation } from 'eitri-i18n'

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

	const { t } = useTranslation()

	return (
		<View className={`flex items-center h-[15px] px-[10px] rounded-[4px] ${STATUS_CLASSES[status]}`}>
			<Text className='text-[8px] font-semibold uppercase tracking-[0.16px]'>
				{t(`loanCard.status.${status}`, STATUS_LABELS[status])}
			</Text>
		</View>
	)
}
