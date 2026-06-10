import { Loading } from 'eitri-shopping-di-santinni-shared'

export default function Quantity(props) {
	const { quantity, handleItemQuantity, disable, loadingQuantity } = props

	return (
		<View className='flex items-center justify-between border border-[#CACACA] rounded-full w-[98px] h-[32px] px-2'>
			<View className='w-[24px] h-[24px] flex items-center justify-center cursor-pointer'>
				{quantity === 1 || disable ? (
					<svg
						width='16px'
						height='16px'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M6 12L18 12'
							stroke='#CCCCCC'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				) : (
					<View onClick={() => handleItemQuantity(-1)}>
						<svg
							width='16px'
							height='16px'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M6 12L18 12'
								stroke='#000000'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>
				)}
			</View>

			{loadingQuantity ? (
				<View className='flex items-center justify-center h-[30px] px-1 flex-1'>
					<Loading className='!w-4 !h-4 text-gray-900' />
				</View>
			) : (
				<Text className='px-1 py-1 text-sm font-medium text-center flex-1'>{quantity}</Text>
			)}

			<View className='w-[24px] h-[24px] flex items-center justify-center cursor-pointer'>
				{disable ? (
					<View className='w-[16px] h-[16px]'>
						<svg
							width='16px'
							height='16px'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M6 12H18M12 6V18'
								stroke='#CCCCCC'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>
				) : (
					<View onClick={() => handleItemQuantity(1)}>
						<svg
							width='16px'
							height='16px'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M6 12H18M12 6V18'
								stroke='#000000'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>
				)}
			</View>
		</View>
	)
}
