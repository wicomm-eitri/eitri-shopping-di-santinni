import React from 'react'

export default function ProfileCardButton(props) {
	const { icon, label, onClick } = props

	return (
		<View
			className='flex justify-between items-center bg-white rounded-full shadow-none border border-gray-200 px-5 py-3 w-full cursor-pointer hover:bg-gray-50 transition-colors'
			onClick={onClick}>
			{/* Lado Esquerdo: Ícone + Label */}
			<View className='flex flex-row items-center gap-3.5'>
				{icon && (
					<Image
						src={icon}
						width={20}
						height={20}
						className='object-contain'
					/>
				)}
				<Text className='text-gray-700 text-sm font-normal tracking-wide'>{label}</Text>
			</View>

			{/* Lado Direito: Seta (Chevron Right minimalista) */}
			<View className='flex items-center justify-center'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='16'
					height='16'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.5'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='text-gray-400'>
					<polyline points='9 18 15 12 9 6'></polyline>
				</svg>
			</View>
		</View>
	)
}
