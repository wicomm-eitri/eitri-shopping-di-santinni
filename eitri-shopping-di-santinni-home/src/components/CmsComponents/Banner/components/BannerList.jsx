import React from 'react'
import { View, Text } from 'eitri-luminus'

export default function BannerList(props) {
	const { data, onClick } = props
	const imagesList = data.images
	const { size, aspectRatio } = data

	const getBannerDimensions = () => {
		const maxWidth = size?.maxWidth
		const maxHeight = size?.maxHeight

		// Puxa as dimensões do CMS. Se não existirem, aí sim cai no padrão 300x400
		let finalWidth = maxWidth ? Number(maxWidth) : 300
		let finalHeight = maxHeight ? Number(maxHeight) : 400

		// Se tiver aspectRatio configurado, calcula a proporção em cima do tamanho
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

	return (
		<View className={`flex flex-col gap-2 ${data?.isHideBanner ? 'hidden' : 'block'}`}>
			{data?.mainTitle && (
				<View className='px-4 mb-8'>
					<Text className='font-semibold text-2xl text-[#0C0C0C]'>{data.mainTitle}</Text>
				</View>
			)}

			<View className='flex overflow-x-auto gap-3 px-4 pb-2'>
				{imagesList &&
					imagesList.map(slider => (
						<View
							key={slider.imageUrl}
							className='flex flex-col'>
							<View
								style={{
									backgroundImage: `url(${slider.imageUrl})`,
									...getBannerDimensions(),
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
										...getBannerDimensions(),
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
	)
}
