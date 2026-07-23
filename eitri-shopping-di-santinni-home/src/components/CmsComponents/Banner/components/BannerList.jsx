import React, { useRef } from 'react'
import { View, Text } from 'eitri-luminus'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

export default function BannerList(props) {
	const { data, onClick } = props
	const scrollRef = useRef(null)

	const imagesList = data.images
	const { size, aspectRatio } = data
	const paramsObject = Object.fromEntries((data?.params || []).map(item => [item.key, item.value]))
	const isBannerTrio =
		Object.values(paramsObject).includes('BannerTrio') || Object.keys(paramsObject).includes('BannerTrio')
	const hasMultipleImages = imagesList?.length > 1
	const showArrows = paramsObject?.arrow === 'on' || isBannerTrio

	const getBannerDimensions = () => {
		const maxWidth = size?.maxWidth
		const maxHeight = size?.maxHeight

		let finalWidth = maxWidth ? Number(maxWidth) : 300
		let finalHeight = maxHeight ? Number(maxHeight) : 400

		if (isBannerTrio) {
			const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400

			finalWidth = screenWidth

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
				console.error(e)
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
	const bannerStep = isBannerTrio ? bannerWidth : bannerWidth + 12

	const getScrollElement = () => {
		if (!scrollRef.current) return null

		return typeof scrollRef.current.getViewElement === 'function'
			? scrollRef.current.getViewElement()
			: scrollRef.current
	}

	const goToSlide = direction => {
		const element = getScrollElement()

		if (!element) return

		const maxScrollLeft = element.scrollWidth - element.clientWidth

		if (direction === 'right') {
			const nextScrollLeft = element.scrollLeft + bannerStep

			element.scrollTo({
				left: nextScrollLeft >= maxScrollLeft - 1 ? 0 : nextScrollLeft,
				behavior: 'smooth'
			})
		} else {
			const prevScrollLeft = element.scrollLeft - bannerStep

			element.scrollTo({
				left: prevScrollLeft <= 0 ? maxScrollLeft : prevScrollLeft,
				behavior: 'smooth'
			})
		}
	}

	return (
		<View
			className={`flex flex-col gap-2 ${data?.isHideBanner ? 'hidden' : 'block'} ${isBannerTrio ? 'mb-[20px]' : ''}`}>
			{data?.mainTitle && (
				<View className='px-4 mb-8'>
					<Text className='font-semibold text-2xl text-[#0C0C0C]'>{data.mainTitle}</Text>
				</View>
			)}

			<View className='relative'>
				<View
					ref={scrollRef}
					className={`flex overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar pb-2 ${isBannerTrio ? '' : 'px-4 gap-3'}`}>
					{imagesList &&
						imagesList.map((slider, idx) => (
							<View
								key={`${slider.imageUrl || slider.id || 'slide'}-${idx}`}
								className='flex flex-col shrink-0 snap-start'>
								<View
									style={{
										backgroundImage: `url(${slider.imageUrl})`,
										...bannerDimensions,
										backgroundSize: 'cover',
										borderRadius: isBannerTrio ? '0px' : '12px'
									}}
									className='relative'
									onClick={() => onClick(slider)}>
									{slider?.subLabel && (
										<View className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-1.5 flex items-center justify-center'>
											<Text className='font-semibold text-red-700 text-[10px] uppercase text-center'>
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
										{/* <Text className='font-bold line-clamp-2 block text-center'>
											{slider?.action?.title}
										</Text> */}
									</View>
								)}
							</View>
						))}
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
