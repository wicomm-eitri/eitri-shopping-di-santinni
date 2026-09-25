import CheckIcon from '../../assets/icons/check-white.svg'

export default function CardCheckbox(props) {
	const { checked, onChange } = props

	const onToggle = () => {
		if (typeof onChange === 'function') onChange(!checked)
	}

	return (
		<View
			onClick={onToggle}
			className={`flex items-center justify-center shrink-0 w-4 h-4 rounded-[2px] border border-[#E23D58] transition-colors duration-200 ${checked ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-white'}`}>
			{checked && (
				<Image
					src={CheckIcon}
					alt=''
					className='w-3 h-3'
				/>
			)}
		</View>
	)
}
