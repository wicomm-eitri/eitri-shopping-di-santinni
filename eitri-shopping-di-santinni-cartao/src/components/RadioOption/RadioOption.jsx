import { View, Text, Image } from 'eitri-luminus'
import RadioCheckedIcon from '../../assets/icons/radio-checked.svg'

export default function RadioOption(props) {
	const { label, selected, onPress } = props

	return (
		<View
			className='flex flex-row items-center h-[60px] px-[10px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'
			onClick={onPress}>
			<View className='flex flex-row items-center gap-[10px]'>
				{selected ? (
					<Image
						src={RadioCheckedIcon}
						alt=''
						className='w-4 h-4'
					/>
				) : (
					<View className='w-4 h-4 rounded-full bg-white border border-[#E23D58]' />
				)}

				<Text
					className={`text-xs leading-5 tracking-[0.24px] text-[#0C0C0C] ${selected ? 'font-semibold' : ''}`}>
					{label}
				</Text>
			</View>
		</View>
	)
}
