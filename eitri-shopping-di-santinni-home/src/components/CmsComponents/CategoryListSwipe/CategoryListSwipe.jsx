import { Text, View } from 'eitri-luminus'
import { processActions } from '../../../services/ResolveCmsActions'
import CategoryPageItem from './components/CategoryPageItem'

export default function CategoryListSwipe({ data }) {
	const openItem = item => processActions(item)

	const title = data?.mainTitle || data?.title

	return (
		<View className='flex flex-col px-4 py-4 w-screen max-w-screen overflow-x-hidden'>
			{title && (
				<Text className='font-bold text-lg text-neutral-900 mb-3 px-1'>
					{title}
				</Text>
			)}

			<View className='grid grid-cols-2 gap-3.5 w-full'>
				{data?.content &&
					data?.content?.map((item, index) => {
						return (
							<CategoryPageItem
								key={`${item.title}-${index}`}
								item={item}
								goToItem={openItem}
							/>
						)
					})}
			</View>

			<View
				bottomInset={'auto'}
				className='w-full'
			/>
		</View>
	)
}

