import { processActions } from '../../../services/ResolveCmsActions'
import CategoryPageItem from './components/CategoryPageItem'

export default function CategoryListSwipe({ data }) {
	const openItem = item => processActions(item)

	return (
		<View className='flex flex-col px-[26px] py-[32px] gap-[30px] w-screen max-w-screen overflow-x-hidden'>
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

			<View
				bottomInset={'auto'}
				className='w-full'
			/>
		</View>
	)
}
