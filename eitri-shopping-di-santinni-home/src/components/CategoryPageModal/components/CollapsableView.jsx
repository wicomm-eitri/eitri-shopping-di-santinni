import { useState, useEffect } from 'react'
import { Text, View } from 'eitri-luminus'

export default function CollapsableView(props) {
	const { children, title, willStartCollapsed } = props
	const [collapsed, setCollapsed] = useState(willStartCollapsed)

	useEffect(() => {
		setCollapsed(!!willStartCollapsed)
	}, [])
	const toggleCollapsedState = () => {
		setCollapsed(!collapsed)
	}

	return (
		<View
			borderTopWidth={'hairline'}
			className='border-neutral-content p-2'>
			<View
				onClick={toggleCollapsedState}
				className='flex flex-row justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors'>
				<Text className='text-base font-medium'>{title}</Text>

				<svg
					viewBox='0 0 24 24'
					width='20'
					height='20'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}>
					<path
						d='M19 14l-7 7-7-7'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</View>
			{!collapsed && <View className='my-2'>{children}</View>}
		</View>
	)
}
