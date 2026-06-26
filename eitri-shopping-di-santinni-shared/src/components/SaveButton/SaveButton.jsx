import { Text, View } from 'eitri-luminus'
import { LuBookmark } from 'react-icons/lu'

export default function SaveButton(props) {
	const { handleSaveFavorite, isInWishlist, disabled = false } = props

	return (
		<View
			onClick={disabled ? undefined : handleSaveFavorite}
			disabled={disabled}
			className={`flex flex-row border ${isInWishlist ? 'border-primary' : 'border-neutral-500'} rounded-full h-8 w-24 justify-center items-center px-2`}>
			<LuBookmark
				size={16}
				color={isInWishlist ? '#ea580c' : '#525252'}
			/>
			<View className='w-1 h-0.5' />
			<Text className={`text-center text-sm font-medium ${isInWishlist ? 'text-primary' : 'text-neutral-700'}`}>
				{isInWishlist ? 'Salvo' : 'Salvar'}
			</Text>
		</View>
	)
}
