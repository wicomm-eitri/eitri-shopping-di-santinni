import { useEffect, useMemo, useRef, useState } from 'react'
import { CustomCarousel } from 'eitri-shopping-di-santinni-shared'
import closeIcon from '../../assets/images/close_white.svg'
import useZoomFixed from '../../utils/ZoomFixed'

export default function ModalImagesPDP(props) {
	const { images, showModal, closeModal, currentSlide = 0, onChange } = props

	const listRef = useRef(null)
	const baseIndexRef = useRef(0)
	const activeThumbIndexRef = useRef(0)

	const safeImages = Array.isArray(images) ? images : []

	const normalizedStart =
		safeImages.length > 0 ? Math.min(Math.max(Number(currentSlide) || 0, 0), safeImages.length - 1) : 0

	const [baseIndex, setBaseIndex] = useState(normalizedStart)
	const [activeThumbIndex, setActiveThumbIndex] = useState(0)
	const [carouselKey, setCarouselKey] = useState(0)

	useEffect(() => {
		baseIndexRef.current = baseIndex
	}, [baseIndex])

	useEffect(() => {
		activeThumbIndexRef.current = activeThumbIndex
	}, [activeThumbIndex])

	useEffect(() => {
		if (!showModal) return

		setBaseIndex(normalizedStart)
		baseIndexRef.current = normalizedStart

		setActiveThumbIndex(0)
		activeThumbIndexRef.current = 0

		setCarouselKey(previous => previous + 1)

		const list = listRef.current

		if (list && typeof list.scrollTo === 'function') {
			list.scrollTo({ top: 0, left: 0, behavior: 'auto' })
		}
	}, [showModal, normalizedStart])

	const orderedImages = useMemo(() => {
		if (safeImages.length === 0) return []

		return [...safeImages.slice(baseIndex), ...safeImages.slice(0, baseIndex)]
	}, [safeImages, baseIndex])

	const getOriginalIndexFromBase = (startIndex, orderedIndex) => {
		if (safeImages.length === 0) return 0

		return (startIndex + orderedIndex) % safeImages.length
	}

	const getOriginalIndex = orderedIndex => {
		return getOriginalIndexFromBase(baseIndex, orderedIndex)
	}

	const {
		registerZoomElement,
		handleImageTouchStart,
		handleImageTouchMove,
		handleImageTouchEnd,
		getZoomStyle,
		resetImageTransform
	} = useZoomFixed({
		showModal,
		normalizedStart: baseIndex,
		listRef,
		onRequestSlide: direction => {
			if (safeImages.length <= 1) return

			const currentBaseIndex = baseIndexRef.current
			const currentOrderedIndex = activeThumbIndexRef.current
			const currentOriginalIndex = getOriginalIndexFromBase(currentBaseIndex, currentOrderedIndex)

			const nextOriginalIndex =
				direction === 'next'
					? (currentOriginalIndex + 1) % safeImages.length
					: (currentOriginalIndex - 1 + safeImages.length) % safeImages.length

			resetImageTransform(currentOrderedIndex)

			setBaseIndex(nextOriginalIndex)
			baseIndexRef.current = nextOriginalIndex

			setActiveThumbIndex(0)
			activeThumbIndexRef.current = 0

			setCarouselKey(previous => previous + 1)

			if (typeof onChange === 'function') {
				onChange(nextOriginalIndex)
			}
		}
	})

	const handleSlideChange = index => {
		const previousIndex = activeThumbIndexRef.current

		if (previousIndex !== index) {
			resetImageTransform(previousIndex)
			resetImageTransform(index)
		}

		setActiveThumbIndex(index)
		activeThumbIndexRef.current = index

		if (typeof onChange === 'function') {
			onChange(getOriginalIndex(index))
		}
	}

	const activeOriginalIndex = getOriginalIndex(activeThumbIndex)
	const progress = safeImages.length > 0 ? `${((activeOriginalIndex + 1) / safeImages.length) * 100}%` : '0%'

	return (
		<Modal
			dialogClassName='relative flex items-center !p-0 !max-h-screen h-screen !max-w-[100vw] w-screen !rounded-none !bg-primary-100/80'
			className={`modal modal-middle${showModal ? ' modal-open' : ''}`}>
			<View className='flex flex-col justify-center w-screen h-screen overflow-hidden'>
				<View
					onClick={closeModal}
					className='absolute top-[100px] right-[18px] z-20 flex items-center justify-center w-12 h-12 rounded-full'>
					<Image
						src={closeIcon}
						alt='Ícone de fechar'
						className='w-4 h-4 pointer-events-none'
					/>
				</View>

				<View className='relative w-screen h-screen overflow-hidden'>
					<View
						ref={listRef}
						className='w-screen h-screen overflow-hidden'>
						<CustomCarousel
							key={carouselKey}
							onSlideChange={handleSlideChange}>
							{orderedImages.map((item, index) => (
								<View
									key={`${item.imageUrl}-${index}`}
									className='relative w-screen min-w-screen h-screen overflow-hidden flex items-center justify-center p-0 m-0 bg-[#F6F6F6]'>
									<View className='relative w-full h-full overflow-hidden flex items-center justify-center'>
										<View
											ref={element => registerZoomElement(index, element)}
											onTouchStart={event => handleImageTouchStart(index, event)}
											onTouchMove={event => handleImageTouchMove(index, event)}
											onTouchEnd={event => handleImageTouchEnd(index, event)}
											onTouchCancel={event => handleImageTouchEnd(index, event)}
											style={getZoomStyle(index)}
											className='relative flex items-center justify-center bg-[#F6F6F6]'>
											<Image
												src={item.imageUrl?.replace(/\?.*/, '')}
												alt={`Imagem ${getOriginalIndex(index) + 1}`}
												className='block max-h-[90%] object-contain select-none mix-blend-multiply'
												draggable={false}
											/>
										</View>
									</View>
								</View>
							))}
						</CustomCarousel>
					</View>

					<View className='h-[3px] w-full bg-meteorite-04 absolute bottom-0 left-0 z-10'>
						<View
							className='h-full bg-meteorite-01 transition-[width,background-color] duration-300 ease-in-out'
							width={progress}
						/>
					</View>
				</View>
			</View>
		</Modal>
	)
}
