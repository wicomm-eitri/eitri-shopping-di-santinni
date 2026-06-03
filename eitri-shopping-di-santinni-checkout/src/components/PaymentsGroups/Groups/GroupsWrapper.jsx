export default function GroupsWrapper(props) {
	const { title, subtitle, icon, children, onPress, className, selected } = props

	return (
		<View className={`bg-[#FCFCFC] border-[1.5px] border-red-700 p-4 ${className || ''}`}>
			<View
				onClick={onPress}
				className='w-full flex flex-row items-center justify-between cursor-pointer'>
				<View className='flex flex-row items-center gap-3'>
					{icon && <View className='text-red-700 flex items-center justify-center'>{icon}</View>}

					<View className='flex flex-col justify-center'>
						<Text className='text-sm font-semibold text-gray-500'>{title}</Text>
						{subtitle && <Text className='text-sm text-gray-400'>{subtitle}</Text>}
					</View>
				</View>

				<View className='flex items-center justify-center pl-2'>
					<View
						className={`w-5 h-5 rounded-full border-[1.5px] border-red-700 bg-white flex items-center justify-center`}>
						{selected && <View className='w-2.5 h-2.5 rounded-full bg-red-700' />}
					</View>
				</View>
			</View>

			{children && <View className='mt-4'>{children}</View>}
		</View>
	)
}
