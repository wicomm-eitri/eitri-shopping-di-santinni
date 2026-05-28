import React from 'react'

export default function NoItem(props) {
	const { title, subtitle, icon } = props

	return (
		<View className='flex flex-col justify-center items-center gap-4 p-6'>
			{icon && (
				<Image
					src={icon}
					width={48}
					height={48}
					className='object-contain'
				/>
			)}
			<Text className='w-full max-w-[200px] text-center font-semibold text-red-700 text-xl leading-tight'>
				{title}
			</Text>
			<Text className='w-full text-center text-gray-500 text-sm'>{subtitle}</Text>
		</View>
	)
}
