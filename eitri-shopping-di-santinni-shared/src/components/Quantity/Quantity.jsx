import React from 'react'
import { Text, View } from 'eitri-luminus'
import { LuMinus, LuPlus } from 'react-icons/lu'
import Loading from '../Loading/LoadingComponent'

export default function Quantity(props) {
	const { quantity, handleItemQuantity, disable } = props

	const [isLoading, setIsLoading] = React.useState(false)

	const handlePressButtonItemQuantity = value => {
		if (!disable) {
			try {
				setIsLoading(true)
				handleItemQuantity(value)
			} catch (error) {
				console.error('[APTC] Erro ao alterar quantidade no carrinho: ', error)
			} finally {
				setIsLoading(false)
			}
		}
	}

	return (
		<View className='flex flex-row border border-neutral-300 rounded-full w-24 h-9 justify-between items-center px-1'>
			<View className='flex items-center justify-center w-1/3'>
				{quantity === 1 || disable ? (
					<LuMinus
						size={16}
						color='#d4d4d4'
					/>
				) : (
					<View onClick={() => handlePressButtonItemQuantity(-1)}>
						<LuMinus
							size={16}
							color='#ea580c'
						/>
					</View>
				)}
			</View>
			<View className='flex items-center justify-center w-1/3'>
				{isLoading ? (
					<View className='w-5'>
						<Loading isLoading={isLoading} />
					</View>
				) : (
					<Text className='font-bold text-neutral-900'>{quantity}</Text>
				)}
			</View>
			<View className='flex items-center justify-center w-1/3'>
				{disable ? (
					<LuPlus
						size={16}
						color='#d4d4d4'
					/>
				) : (
					<View onClick={() => handlePressButtonItemQuantity(1)}>
						<LuPlus
							size={16}
							color='#ea580c'
						/>
					</View>
				)}
			</View>
		</View>
	)
}
