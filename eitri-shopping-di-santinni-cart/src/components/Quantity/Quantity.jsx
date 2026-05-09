import { Loading } from 'eitri-shopping-di-santinni-shared'

export default function Quantity(props) {
	const { quantity, handleItemQuantity, disable, loadingQuantity } = props

	return (
		<View className='flex items-center border border-gray-300 px-2.5 w-20'>
			<View className='w-1/3 flex items-center justify-center'>
				{quantity === 1 || disable ? (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='11'
						height='1'
						viewBox='0 0 11 1'
						fill='none'>
						<path
							d='M0.5 0.5H9.83333'
							stroke='#CCCCCC'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				) : (
					<View onClick={() => handleItemQuantity(-1)}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='11'
							height='1'
							viewBox='0 0 11 1'
							fill='none'>
							<path
								d='M0.5 0.5H9.83333'
								stroke='black'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>
				)}
			</View>

			{loadingQuantity ? (
				<View className='flex items-center justify-center h-[30px] px-1'>
					<Loading className='!w-4 !h-4 text-gray-900' />
				</View>
			) : (
				<Text className='px-1 py-[7px] text-xs font-medium min-w-[23px] text-center'>{quantity}</Text>
			)}

			<View className='w-1/3 items-center justify-center pl-1'>
				{disable ? (
					<View className='w-[16px] h-[16px]'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='11'
							height='11'
							viewBox='0 0 11 11'
							fill='none'>
							<path
								d='M5.16667 0.5V9.83333M0.5 5.16667H9.83333'
								stroke='#CCCCCC'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>
				) : (
					<View onClick={() => handleItemQuantity(1)}>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='11'
							height='11'
							viewBox='0 0 11 11'
							fill='none'>
							<path
								d='M5.16667 0.5V9.83333M0.5 5.16667H9.83333'
								stroke='black'
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
