import { CustomButton } from 'eitri-shopping-di-santinni-shared'

export default function BenefitBanner(props) {
	const { title, actionLabel, image, onPressAction } = props

	return (
		<View className='relative w-full h-[105px] px-6 py-[10px] rounded-lg bg-[#FAFAF8] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)]'>
			<View className='flex flex-col gap-3 w-[147px] h-full'>
				<Text className='text-sm leading-3 text-black'>{title}</Text>

				<CustomButton
					outlined
					className='!h-6 !w-[107px] !border-[#C8102E]'
					onPress={onPressAction}>
					<Text className='text-[10px] font-semibold uppercase leading-6 tracking-[0.2px] text-[#C8102E]'>
						{actionLabel}
					</Text>
				</CustomButton>
			</View>

			<Image
				src={image}
				alt=''
				className='absolute right-6 top-2 w-[148px] h-[89px]'
			/>
		</View>
	)
}
