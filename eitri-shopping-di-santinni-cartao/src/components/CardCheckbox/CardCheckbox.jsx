import { View } from 'eitri-luminus'

export default function CardCheckbox(props) {
	const { checked, onChange } = props

	const onToggle = () => {
		if (typeof onChange === 'function') onChange(!checked)
	}

	return (
		<View
			onClick={onToggle}
			className={`shrink-0 w-4 h-4 rounded-[2px] border border-[#E23D58] transition-colors duration-200 ${checked ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-white'}`}
		/>
	)
}
