import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { getSpacingValue } from '../../utils/utils'
import ShelfOfProductsCarousel from './components/ShelfOfProductsCarousel'
import ShelfOfProductsSlider from './components/ShelfOfProductsSlider'

export default function ShelfOfProducts(props) {
	const { products, title, isLoading, mode, searchParams, params, ...rest } = props
	const { t } = useTranslation()

	const seeMore = () => {
		Eitri.navigation.navigate({
			path: 'ProductCatalog',
			state: {
				params: searchParams,
				title: title
			}
		})
	}

	const marginTop = getSpacingValue(params?.marginTop)
	const marginBottom = getSpacingValue(params?.marginBottom)

	return (
		<View
			className='mb-[37px]'
			style={{
				...(marginTop && { marginTop }),
				...(marginBottom && { marginBottom })
			}}>
			{title && (
				<View className={`flex justify-between items-center px-4 mb-5`}>
					<Text className='font-semibold text-xl'>{isLoading ? t('shelfOfProducts.loading') : title}</Text>

					{/* {searchParams && (
						<View
							onClick={seeMore}
							className='flex items-center min-w-fit'>
							<Text className='font-semibold text-sm underline'>
								{t('shelfOfProducts.seeMore', 'Ver mais')}
							</Text>
						</View>
					)} */}
				</View>
			)}

			{mode === 'carousel' && (
				<ShelfOfProductsCarousel
					isLoading={isLoading}
					products={products}
				/>
			)}

			{mode !== 'carousel' && (
				<ShelfOfProductsSlider
					isLoading={isLoading}
					products={products}
				/>
			)}
		</View>
	)
}
