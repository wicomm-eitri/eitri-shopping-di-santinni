import { Text, View } from 'eitri-luminus'

export default function CategoryTitle(props) {
	const { onClick, title, icon, hasSubItems, textClassName, isCard, color } = props
	const imgSrc = icon || props.imageUrl || props.thumbnail || props.image

	if (isCard) {
		return (
			<View
				onClick={onClick}
				className='relative rounded-xl overflow-hidden bg-[#C5C5C5] h-[115px] w-full flex items-center justify-center p-2 cursor-pointer transition-opacity active:opacity-80'
				style={{ backgroundColor: color || '#C5C5C5' }}>
				{imgSrc && (
					<View className='flex items-center justify-center h-full pb-4 pt-1 w-full'>
						<Image
							className='max-h-[70px] max-w-[85%] object-contain'
							src={imgSrc}
						/>
					</View>
				)}
				{title && (
					<Text className='absolute bottom-2.5 left-3 font-bold text-white text-base leading-tight drop-shadow-sm'>
						{title}
					</Text>
				)}
			</View>
		)
	}

	return (
		<View
			onClick={onClick}
			className='flex justify-between items-center bg-white'>
			<View className='flex items-center gap-4'>
				{imgSrc && (
					<Image
						className='max-w-[30px]'
						src={imgSrc}
					/>
				)}
				<Text
					className={`${textClassName || ''} ${hasSubItems ? 'text-neutral-700' : 'text-neutral-900'} tracking-[0.32px] leading-5`}>
					{title}
				</Text>
			</View>

			{hasSubItems && (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='8'
					height='14'
					viewBox='0 0 8 14'
					fill='none'>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M5.76439 6.99996L5.76232e-07 12.8631L1.11785 14L8 6.99996L1.11785 -1.55533e-06L1.60136e-06 1.13698L5.76439 6.99996Z'
						fill='#555555'
					/>
				</svg>
			)}
		</View>
	)
}
