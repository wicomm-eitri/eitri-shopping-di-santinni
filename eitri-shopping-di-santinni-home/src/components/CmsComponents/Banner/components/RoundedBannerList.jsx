import { Text, View } from 'eitri-luminus'

export default function RoundedBannerList(props) {
	const { data, onClick } = props
	const { size } = data

	const imagesList = data.images || []

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

	return (
		<View className='w-full bg-[#F5F5F5] py-6 mb-4'>
			{data.mainTitle && (
				<View className='px-4 mb-5 flex items-center justify-center w-full'>
					<Text className='font-semibold text-xl text-[#0C0C0C] tracking-wide uppercase'>
						{data.mainTitle}
					</Text>
				</View>
			)}

			<View
				className='flex overflow-x-auto  px-4 gap-4 justify-center w-full'
				title={data.mainTitle}>
				{imagesList.map((slider, index) => {
					const hasImage = !!slider.imageUrl
					const labelText = slider?.action?.title || slider?.title

					return (
						<View
							key={slider.imageUrl || `circle-${index}`}
							className='flex flex-col items-center justify-start shrink-0 '
							onClick={() => onClick(slider)}>
							<View
								style={{
									...getBannerDimensions(),
									...(hasImage
										? {
												backgroundImage: `url(${slider.imageUrl})`,
												backgroundSize: 'cover',
												backgroundPosition: 'center'
											}
										: {})
								}}
								className={`rounded-full flex items-center justify-center transition-opacity active:opacity-70 ${
									hasImage ? 'shadow-md border-none' : 'border-[1.5px] border-red-700 bg-transparent'
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
	)
}
