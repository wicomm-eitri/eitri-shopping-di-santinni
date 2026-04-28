import { getSpacingValue } from '../../../../utils/utils'

export default function FitOnScreen(props) {
	const { data, onClick } = props

	const paramsObject = Object.fromEntries((data?.params || []).map(item => [item.key, item.value]))

	const marginTop = getSpacingValue(paramsObject?.marginTop)
	const marginBottom = getSpacingValue(paramsObject?.marginBottom)

	return (
		<View
			className={`${data?.isHideBanner ? 'hidden' : `flex flex-col`}`}
			style={{
				...(marginTop && { marginTop }),
				...(marginBottom && { marginBottom })
			}}>
			{data?.mainTitle && (
				<View className='px-4'>
					<Text className='font-bold text-lg'>{data.mainTitle}</Text>
				</View>
			)}

			<View className={`flex justify-between ${data?.images.length > 1 ? 'px-4 gap-2' : ''}`}>
				{data?.images?.map(image => (
					<View
						key={image.imageUrl}
						onClick={() => onClick(image)}
						className='w-full'>
						<Image
							src={image.imageUrl}
							className={`h-[95vh] w-full ${data?.images.length > 1 ? 'rounded ' : ''}`}
						/>

						{image.action?.title && <Text className='text-center mt-2'>{image.action.title}</Text>}
					</View>
				))}
			</View>
		</View>
	)
}
