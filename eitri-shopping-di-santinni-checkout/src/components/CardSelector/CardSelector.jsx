import { FaChevronRight, FaTrash } from 'react-icons/fa'

export default function CardSelector(props) {
	const {
		children,
		mainTitle,
		mainClickHandler,
		secondaryActionHandler,
		secondaryActionTitle,
		selectable,
		checked,
		onSelect,
		radioName,
		onRemove
	} = props

	const shouldShowRemove = typeof onRemove === 'function'

	const handleClick = () => {
		if (selectable) {
			typeof onSelect === 'function' && onSelect()
			return
		}

		typeof mainClickHandler === 'function' && mainClickHandler()
	}

	return (
		<View className='border border-red-700 p-4 rounded relative'>
			<View
				onClick={handleClick}
				className='flex flex-col'>
				<View className='flex items-center justify-between gap-2'>
					<Text className='font-semibold text-gray-500 border-red-700  block'>{mainTitle}</Text>

					{selectable ? (
						<Radio
							className='radio-primary'
							name={radioName || 'card-selector'}
							checked={!!checked}
							onChange={() => typeof onSelect === 'function' && onSelect()}
						/>
					) : (
						<FaChevronRight className='text-red-700 border-red-700 w-[24px]' />
					)}
				</View>

				{children}
			</View>

			{shouldShowRemove && (
				<View
					className='absolute bottom-3 right-4 text-red-700 border-red-700 '
					onClick={e => {
						e.stopPropagation()
						onRemove()
					}}>
					<FaTrash className='w-5 h-5' />
				</View>
			)}
		</View>
	)
}
