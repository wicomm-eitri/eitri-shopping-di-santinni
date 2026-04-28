import { getSpacingValue } from '../../../../utils/utils'

export default function SliderHero(props) {
	const { data, onClick } = props

	const [currentSlide, setCurrentSlide] = useState(0)
	const imagesList = data.images

	if (!imagesList.length) return null

	const onChangeSlide = i => setCurrentSlide(i)

	let proportionalHeight = 'auto'

	if (data?.aspectRatio) {
		try {
			const [aspectWidth, aspectHeight] = data?.aspectRatio?.split(':')?.map(Number) || []
			const screenWidth = window.innerWidth

			proportionalHeight = screenWidth * (aspectHeight / aspectWidth)
		} catch (e) {
			console.error('Error calculating aspect ratio [SliderHero]:', e)
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

	const paramsObject = Object.fromEntries((data?.params || []).map(item => [item.key, item.value]))

	const marginTop = getSpacingValue(paramsObject?.marginTop)
	const marginBottom = getSpacingValue(paramsObject?.marginBottom)

	return (
		<View
			className={`relative ${data?.isHideBanner ? 'hidden' : `flex flex-col`}`}
			style={{
				...(marginTop && { marginTop }),
				...(marginBottom && { marginBottom })
			}}>
			{data.mainTitle && (
				<View className='flex items-center justify-center w-full px-4'>
					<Text className='font-semibold mb-8'>{data.mainTitle}</Text>
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
								className={`${currentSlide === index ? 'bg-primary w-9' : 'bg-neutral-400 w-3'} h-3 rounded-lg transition-[width,background-color] duration-300 ease-in-out`}
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
