export default function ImageCard(props) {
	const { imageUrl, className = '' } = props

	return (
		<View className={`min-w-12 min-h-12 rounded flex justify-center items-center ${className}`}>
			<Image
				src={imageUrl}
				className='w-full max-w-full h-full max-h-full'
			/>
		</View>
	)
}
