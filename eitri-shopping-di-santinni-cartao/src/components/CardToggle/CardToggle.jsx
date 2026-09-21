export default function CardToggle(props) {
	const { checked, onChange } = props

	const onToggle = () => {
		if (typeof onChange === 'function') onChange(!checked)
	}

	return (
		<View
			onClick={onToggle}
			className={`relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gray-300'}`}>
			<View
				className={`absolute top-[2.5px] w-[15px] h-[15px] rounded-full bg-white transition-all duration-200 ${checked ? 'left-[18.5px]' : 'left-[2.5px]'}`}
			/>
		</View>
	)
}
