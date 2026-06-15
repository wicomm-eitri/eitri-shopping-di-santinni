import React, { useState } from 'react'
import { View, Text } from 'eitri-luminus'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

export default function BannerList(props) {
	const { data, onClick } = props
	const [currentIndex, setCurrentIndex] = useState(0)
	const [dragOffset, setDragOffset] = useState(0)
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const imagesList = data.images
	const { size, aspectRatio } = data
	const paramsObject = Object.fromEntries((data?.params || []).map(item => [item.key, item.value]))
	const hasMultipleImages = imagesList?.length > 1
	const showArrows = paramsObject?.arrow === 'on'

	const getBannerDimensions = () => {
		const maxWidth = size?.maxWidth
		const maxHeight = size?.maxHeight

		let finalWidth = maxWidth ? Number(maxWidth) : 300
		let finalHeight = maxHeight ? Number(maxHeight) : 400

		if (imagesList?.length === 1) {
			const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400
			finalWidth = screenWidth - 32

			if (aspectRatio) {
				try {
					const [aspectW, aspectH] = aspectRatio.split(':').map(Number)
					const ratio = aspectH / aspectW
					if (!isNaN(ratio)) {
						finalHeight = finalWidth * ratio
					}
				} catch (e) {
					// ignore
				}
			} else if (maxWidth && maxHeight) {
				const ratio = Number(maxHeight) / Number(maxWidth)
				finalHeight = finalWidth * ratio
			}

			return {
				width: `${Math.round(finalWidth)}px`,
				height: `${Math.round(finalHeight)}px`,
				...(aspectRatio ? { aspectRatio: aspectRatio.replace(':', '/') } : {})
			}
		}

		if (aspectRatio) {
			try {
				const [aspectW, aspectH] = aspectRatio.split(':').map(Number)
				const ratio = aspectH / aspectW

				if (!isNaN(ratio)) {
					if (!maxWidth && !maxHeight) {
						const screenWidth = window.innerWidth * 0.8

						finalWidth = screenWidth
						finalHeight = screenWidth * ratio
					} else if (maxWidth && !maxHeight) {
						finalWidth = Number(maxWidth)
						finalHeight = Number(maxWidth) * ratio
					} else if (!maxWidth && maxHeight) {
						finalHeight = Number(maxHeight)
						finalWidth = Number(maxHeight) / ratio
					} else if (maxWidth && maxHeight) {
						const heightByWidth = Number(maxWidth) * ratio

						if (heightByWidth > Number(maxHeight)) {
							finalHeight = Number(maxHeight)
							finalWidth = Number(maxHeight) / ratio
						} else {
							finalWidth = Number(maxWidth)
							finalHeight = heightByWidth
						}
					}
				}
			} catch (e) {
				// ignore malformed aspectRatio from CMS
			}
		}

		return {
			width: `${Math.round(finalWidth)}px`,
			height: `${Math.round(finalHeight)}px`,
			...(aspectRatio ? { aspectRatio: aspectRatio.replace(':', '/') } : {})
		}
	}

	const bannerDimensions = getBannerDimensions()
	const bannerWidth = Number.parseInt(bannerDimensions.width, 10) || 300
	const bannerStep = bannerWidth + 12

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
		<View className={`flex flex-col gap-2 ${data?.isHideBanner ? 'hidden' : 'block'}`}>
			{data?.mainTitle && (
				<View className='px-4 mb-8'>
					<Text className='font-semibold text-2xl text-[#0C0C0C]'>{data.mainTitle}</Text>
				</View>
			)}

			<View className='relative'>
				<View className='overflow-hidden px-4 pb-2'>
					<View
						className='flex gap-3 transition-transform duration-300 ease-out touch-pan-y'
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
						}}>
						{imagesList &&
							imagesList.map((slider, idx) => (
								<View
									key={`${slider.imageUrl || slider.id || 'slide'}-${idx}`}
									className='flex flex-col'>
									<View
										style={{
											backgroundImage: `url(${slider.imageUrl})`,
											...bannerDimensions,
											backgroundSize: 'cover',
											borderRadius: '12px'
										}}
										className='relative'
										onClick={() => onClick(slider)}>
										{slider?.subLabel && (
											<View className='absolute bottom-3 left-3 bg-white rounded-full px-4 py-1.5'>
												<Text className='font-semibold text-red-700 text-sm uppercase'>
													{slider.subLabel}
												</Text>
											</View>
										)}
									</View>

									{slider?.action?.title && (
										<View
											style={{
												...bannerDimensions,
												height: 'initial'
											}}
											className='mt-1'>
											<Text className='font-bold line-clamp-2 block text-center'>
												{slider?.action?.title}
											</Text>
										</View>
									)}
								</View>
							))}
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
