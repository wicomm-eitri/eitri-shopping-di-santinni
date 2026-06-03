import zoom from '../../assets/images/zoom.svg'
import ModalImagesPDP from './ModalImagesPDP'

export default function ImageCarousel(props) {
	const { currentSku } = props

	const [currentSlide, setCurrentSlide] = useState(0)
	const [carouselProgressPercentage, setCarouselProgressPercentage] = useState(0)
	const [showProgressBar, setShowProgressBar] = useState(false)
	const [showModalImagePDP, setShowModalImagePDP] = useState(false)

	const viewScrollRef = useRef(null)

	const images = currentSku?.images || []

	useEffect(() => {
		if (viewScrollRef?.current) {
			const element = viewScrollRef.current?.getViewElement()

			if (element) {
				const scrollWidth = element.scrollWidth || 0
				const clientWidth = element.clientWidth || 0

				if (scrollWidth > clientWidth) {
					setShowProgressBar(true)
				}
			}
		}
	}, [currentSku])

	useEffect(() => {
		setCurrentSlide(0)
		setCarouselProgressPercentage(0)
	}, [currentSku])

	const onChange = index => {
		setCurrentSlide(index)
	}

	const onThumbnailsScroll = event => {
		const target = event?.currentTarget

		if (!target || images.length < 2) {
			setCarouselProgressPercentage(0)

			return
		}

		const scrollLeft = target.scrollLeft || 0
		const scrollWidth = target.scrollWidth || 0
		const clientWidth = target.clientWidth || 0

		const maxScroll = scrollWidth - clientWidth

		if (maxScroll <= 0) {
			setCarouselProgressPercentage(0)

			return
		}

		const progress = scrollLeft / maxScroll
		const percentage = Math.min(Math.max(progress * 100, 0), 100)

		setCarouselProgressPercentage(percentage)
	}

	return (
		<View className='mx-4'>
			<View className='relative'>
				<Image
					pinchZoom
					zoomMaxScale={8}
					fadeIn={500}
					src={images[currentSlide]?.imageUrl}
					width='100vw'
				/>
				<View
				onClick={() => setShowModalImagePDP(true)}
				className='absolute top-2.5 right-[18px] p-1.5 rounded-full bg-primary flex items-center justify-center'>
					<Image
						src={zoom}
						width='19px'
						height='19px'
					/>
				</View>
			</View>

			<View
				ref={viewScrollRef}
				onScroll={onThumbnailsScroll}
				className='flex gap-2 overflow-x-auto py-2 scroll-smooth snap-x snap-mandatory'>
				{images.map((item, index) => (
					<View
						key={`${item.imageUrl}-${index}`}
						className='flex w-16 h-16 shrink-0 snap-start justify-center items-center'
						onClick={() => onChange(index)}>
						<Image
							fadeIn={500}
							src={item.imageUrl}
							width='64px'
							height='64px'
						/>
					</View>
				))}
			</View>
			{showProgressBar && (
				<View className='relative w-full h-1.5 mt-2 rounded overflow-hidden'>
					<View
						style={{
							left: `calc(${carouselProgressPercentage}% - ${(carouselProgressPercentage / 100) * 64}px)`
						}}
						className='absolute w-16 h-1.5 bg-gray-900 rounded'
					/>
				</View>
			)}
			<ModalImagesPDP
				images={images}
				showModal={showModalImagePDP}
				closeModal={() => setShowModalImagePDP(false)}
				currentSlide={currentSlide}
				onChange={onChange}
			/>
		</View>
	)
}
