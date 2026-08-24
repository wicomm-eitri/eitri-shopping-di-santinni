export default function CategoryGroupTitle({ title, variant }) {
	if (variant === 'size') {
		return (
			<View>
				<Text className='font-bold text-sm text-[#0C0C0C] uppercase tracking-[0.32px]'>{title}</Text>
			</View>
		)
	}

	return (
		<View>
			<Text className='leading-5 text-red-700 tracking-[0.32px]'>{title}</Text>
		</View>
	)
}
