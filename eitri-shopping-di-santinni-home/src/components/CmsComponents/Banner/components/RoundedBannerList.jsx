import React, { useState } from 'react'
import { Text, View } from 'eitri-luminus'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

export default function RoundedBannerList(props) {
	const { data, onClick } = props
	const { size } = data

	const imagesList = data.images || []

	console.log('IMAGES LIST: ', imagesList)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [dragOffset, setDragOffset] = useState(0)
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)

	const paramsObject = Object.fromEntries((data?.params || []).map(item => [item.key, item.value]))
	const hasMultipleImages = imagesList?.length > 1
	const showArrows = paramsObject?.arrow === 'on'

	const getBannerDimensions = () => {
		const maxWidth = size?.maxWidth
		const maxHeight = size?.maxHeight

		if (maxWidth || maxHeight) {
			const max = Math.max(parseInt(maxWidth || 0), parseInt(maxHeight || 0))

			if (max > 0) {
				return { width: `${max}px`, height: `${max}px` }
			}
		}

		return { width: `72px`, height: `72px` }
	}

	const bannerDimensions = getBannerDimensions()
	const bannerWidth = Number.parseInt(bannerDimensions.width, 10) || 72
	const bannerStep = bannerWidth + 16 // 16px for gap-4

	const goToSlide = direction => {
		if (!imagesList?.length) return

		setDragOffset(0)
		setIsDragging(false)

		const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 400
		const itemsVisible = Math.max(1, Math.floor(containerWidth / bannerStep))
		const maxIndex = Math.max(0, imagesList.length - itemsVisible)

		setCurrentIndex(current => {
			if (direction === 'right') {
				return current >= maxIndex ? 0 : current + 1
			}

			return current <= 0 ? maxIndex : current - 1
		})
	}

	const handleDragStart = clientX => {
		if (!hasMultipleImages) return

		setIsDragging(true)
		setStartX(clientX)
		setDragOffset(0)
	}

	const handleDragMove = clientX => {
		if (!isDragging) return

		setDragOffset(clientX - startX)
	}

	const handleDragEnd = () => {
		if (!isDragging) return

		const threshold = 50

		if (Math.abs(dragOffset) > threshold) {
			if (dragOffset > 0) {
				goToSlide('left')
			} else {
				goToSlide('right')
			}
		} else {
			setDragOffset(0)
			setIsDragging(false)
		}
	}

	return (
		<View className='w-full bg-[#F5F5F5] py-6 mb-4'>
			{data.mainTitle && (
				<View className='px-4 mb-5 flex items-center justify-center w-full'>
					<Text className='font-semibold text-xl text-[#0C0C0C] tracking-wide uppercase'>
						{data.mainTitle}
					</Text>
				</View>
			)}

			<View className='relative'>
				<View className='overflow-hidden px-4 pb-2 w-full'>
					<View
						className='flex gap-4 transition-transform duration-300 ease-out touch-pan-y justify-start'
						onTouchStart={e => handleDragStart(e.touches[0].clientX)}
						onTouchMove={e => handleDragMove(e.touches[0].clientX)}
						onTouchEnd={handleDragEnd}
						onMouseDown={e => handleDragStart(e.clientX)}
						onMouseMove={e => isDragging && handleDragMove(e.clientX)}
						onMouseUp={handleDragEnd}
						onMouseLeave={handleDragEnd}
						style={{
							transform: `translateX(calc(-${currentIndex * bannerStep}px + ${dragOffset}px))`,
							transitionDuration: isDragging ? '0ms' : '300ms'
						}}
						title={data.mainTitle}>
						{imagesList.map((slider, index) => {
							const hasImage = !!slider.imageUrl
							const labelText = slider?.action?.title || slider?.title

							return (
								<View
									key={`${slider.imageUrl || slider.id || 'circle'}-${index}`}
									className='flex flex-col items-center justify-start shrink-0'
									onClick={() => onClick(slider)}>
									<View
										style={{
											...bannerDimensions,
											...(hasImage
												? {
														backgroundImage: `url(${slider.imageUrl})`,
														backgroundSize: 'cover',
														backgroundPosition: 'center'
													}
												: {})
										}}
										className={`rounded-full flex items-center justify-center transition-opacity active:opacity-70 ${
											hasImage
												? 'shadow-md border-none'
												: 'border-[1.5px] border-red-700 bg-transparent'
										}`}>
										{!hasImage && labelText && (
											<Text className='font-semibold text-xl text-red-700'>{labelText}</Text>
										)}
									</View>

									{hasImage && labelText && (
										<View className='pt-2 max-w-[80px]'>
											<Text className='font-bold text-center line-clamp-2 leading-4 text-sm text-neutral-800'>
												{labelText}
											</Text>
										</View>
									)}
								</View>
							)
						})}
					</View>
				</View>

				{hasMultipleImages && showArrows && (
					<>
						<View
							className='absolute left-3 top-1/2 -translate-y-1/2 z-10 '
							onClick={() => goToSlide('left')}>
							<View className='w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'>
								<LuChevronLeft className='text-red-700 text-sm' />
							</View>
						</View>

						<View
							className='absolute right-3 top-1/2 -translate-y-1/2 z-10 '
							onClick={() => goToSlide('right')}>
							<View className='w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'>
								<LuChevronRight className='text-red-700 text-sm' />
							</View>
						</View>
					</>
				)}
			</View>
		</View>
	)
}
