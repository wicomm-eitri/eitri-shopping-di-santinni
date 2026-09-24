import { useState } from 'react'
import ChevronDownIcon from '../../assets/icons/chevron-down.svg'

export default function SelectField(props) {
	const { options, value, placeholder, onChange } = props

	const [isOpen, setIsOpen] = useState(false)

	const selectedOption = options.find(option => option.value === value)

	const onPressOption = option => {
		onChange(option.value)
		setIsOpen(false)
	}

	return (
		<View className='relative w-full'>
			<View
				className='flex flex-row items-center justify-between w-full py-[14px] px-4 rounded bg-white border border-gray-200'
				onClick={() => setIsOpen(!isOpen)}>
				<Text className={`text-sm tracking-[0.28px] ${selectedOption ? 'text-black' : 'text-neutral-400'}`}>
					{selectedOption ? selectedOption.label : placeholder}
				</Text>

				<Image
					src={ChevronDownIcon}
					alt=''
					className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
				/>
			</View>

			{isOpen && (
				<View className='absolute top-[46px] left-0 z-10 flex flex-col w-full overflow-hidden rounded bg-white border border-gray-200 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.15)]'>
					{options.map(option => (
						<View
							key={option.value}
							className='px-4 py-3 border-b border-gray-100'
							onClick={() => onPressOption(option)}>
							<Text
								className={`text-sm tracking-[0.28px] ${option.value === value ? 'font-semibold text-black' : 'text-gray-700'}`}>
								{option.label}
							</Text>
						</View>
					))}
				</View>
			)}
		</View>
	)
}
