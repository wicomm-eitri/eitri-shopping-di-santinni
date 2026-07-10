export default function HeaderText(props) {
	const { text, className = '' } = props

	return (
		<View>
			<Text className={`text-header-content text-xl font-medium text-neutral-900 truncate ${className}`}>{text}</Text>
		</View>
	)
}
