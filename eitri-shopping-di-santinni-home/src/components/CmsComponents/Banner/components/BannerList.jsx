export default function BannerList(props) {
	const { data, onClick } = props
	const imagesList = data.images
	const { size, aspectRatio } = data

	const getBannerDimensions = () => {
		const maxWidth = size?.maxWidth
		const maxHeight = size?.maxHeight

		let finalWidth = maxWidth || 300
		let finalHeight = maxHeight || 400

		if (aspectRatio) {
			try {
				const [aspectW, aspectH] = aspectRatio.split(':').map(Number)
				const ratio = aspectH / aspectW

				if (!isNaN(ratio)) {
					// ✅ Se NÃO passou nenhum limite → usa 80% da tela
					if (!maxWidth && !maxHeight) {
						const screenWidth = window.innerWidth * 0.8

						finalWidth = screenWidth
						finalHeight = screenWidth * ratio
					}

					// Só maxWidth
					else if (maxWidth && !maxHeight) {
						finalWidth = maxWidth
						finalHeight = maxWidth * ratio
					}

					// Só maxHeight
					else if (!maxWidth && maxHeight) {
						finalHeight = maxHeight
						finalWidth = maxHeight / ratio
					}

					// Ambos
					else if (maxWidth && maxHeight) {
						const heightByWidth = maxWidth * ratio

						if (heightByWidth > maxHeight) {
							finalHeight = maxHeight
							finalWidth = maxHeight / ratio
						} else {
							finalWidth = maxWidth
							finalHeight = heightByWidth
						}
					}
				}
			} catch (e) {
				console.error('Error calculating aspect ratio [BannerList]:', e)
			}
		}

		return {
			width: `${Math.round(finalWidth)}px`,
			height: `${Math.round(finalHeight)}px`,
			aspectRatio: aspectRatio?.replace(':', '/')
		}
	}

	return (
		<View className={`flex flex-col gap-2 ${data?.isHideBanner ? 'hidden' : 'block'}`}>
			{data?.mainTitle && (
				<View className='px-4'>
					<Text className='font-bold text-lg'>{data.mainTitle}</Text>
				</View>
			)}

			<View className='flex overflow-x-auto gap-2.5 px-4'>
				{imagesList &&
					imagesList.map(slider => (
						<View
							key={slider.imageUrl}
							className='flex flex-col'>
							<View // Adicionado key para melhor performance e para seguir as boas práticas do React
								style={{
									backgroundImage: `url(${slider.imageUrl})`,
									...getBannerDimensions(),
									backgroundSize: 'cover'
								}}
								className='rounded'
								onClick={() => onClick(slider)}
							/>

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
