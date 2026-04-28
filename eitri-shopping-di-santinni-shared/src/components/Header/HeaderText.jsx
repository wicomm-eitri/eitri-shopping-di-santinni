export default function HeaderText(props) {
	const { text, className = '' } = props

	return (
		<View>
			<Text className={`text-header-content text-xl font-semibold ${className}`}>{text}</Text>
		</View>
	)
}
