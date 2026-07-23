export default function ImageCard(props) {
	const { imageUrl, className = '' } = props

	const formattedImageUrl =
		typeof imageUrl === 'string' ? imageUrl.replace(/\/(\d+)-\d+-\d+\//, '/$1-500-500/') : imageUrl

	return (
		<View className={`min-w-12 min-h-12 rounded flex justify-center items-center ${className}`}>
			<Image
				src={formattedImageUrl}
				className='w-full max-w-full h-full max-h-full'
			/>
		</View>
	)
}
