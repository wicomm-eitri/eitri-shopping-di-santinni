export default function SliderHero(props) {
	const { data, onClick } = props

	const [currentSlide, setCurrentSlide] = useState(0)
	const imagesList = data.images

	const onChangeSlide = i => setCurrentSlide(i)

	let proportionalHeight = 'auto'

	if (data?.aspectRatio) {
		try {
			const [aspectWidth, aspectHeight] = data.aspectRatio.split(':').map(Number)

			const screenWidth = window.innerWidth
			proportionalHeight = screenWidth * (aspectHeight / aspectWidth)
		} catch (e) {
			// ignore malformed aspectRatio from CMS
		}
	}

	const renderImage = image => (
		<Carousel.Item
			key={`image_${image.imageUrl}`}
			className='w-full'>
			<View
				onClick={() => onClick(image)}
				height={proportionalHeight}
				className='w-full'>
				<Image
					fadeIn={1000}
					className='w-full h-full'
					src={image.imageUrl}
				/>
			</View>
		</Carousel.Item>
	)

	const hasMultipleImages = imagesList?.length > 1
	const hasSingleImage = imagesList?.length === 1

	return (
		<View className={` relative ${data?.isHideBanner ? 'hidden' : 'flex flex-col'}`}>
			{data.mainTitle && (
				<View className='px-4 flex items-center justify-center w-full'>
					<Text className='font-bold mb-8'>{data.mainTitle}</Text>
				</View>
			)}

			{hasMultipleImages ? (
				<>
					<Carousel
						config={{
							autoPlay: data.autoPlay || true,
							interval: 6000,
							loop: true,
							currentSlide,
							onChange: onChangeSlide
						}}>
						{imagesList.map(renderImage)}
					</Carousel>

					<View className='absolute left-0 right-0 flex justify-center items-center gap-1 bottom-4'>
						{imagesList.map((_, index) => (
							<View
								key={index}
								className={`${currentSlide === index ? 'bg-red-700' : 'bg-white'} w-3 h-3 rounded-full transition-[width,background-color] duration-300 ease-in-out`}
							/>
						))}
					</View>
				</>
			) : hasSingleImage ? (
				renderImage(imagesList[0])
			) : null}
		</View>
	)
}
