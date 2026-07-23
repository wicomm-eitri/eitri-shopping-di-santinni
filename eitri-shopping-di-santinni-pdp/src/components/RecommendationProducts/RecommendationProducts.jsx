import { useTranslation } from 'eitri-i18n'
import { BottomInset } from 'eitri-shopping-di-santinni-shared'
import { getProductsRecommendations } from '../../services/productService'
import ShelfOfProductsCarousel from '../ShelfOfProducts/components/ShelfOfProductsCarousel'

export default function RecommendationProducts(props) {
	const { product } = props
	const { t } = useTranslation()

	const [recommendationProducts, setRecommendationProducts] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (!product) return

		loadRecommendationProducts(product?.productId)
	}, [product])

	const loadRecommendationProducts = async productId => {
		try {
			setIsLoading(true)

			const recommendationProducts = await getProductsRecommendations(productId)

			// 2. Agrupar por productId usando Map (🔥 mais performático)
			const productMap = new Map()

			recommendationProducts?.forEach(product => {
				if (!productMap.has(product.productId)) {
					productMap.set(product.productId, {
						...product,
						items: [...product.items]
					})
				} else {
					const existing = productMap.get(product.productId)

					existing.items = [...existing.items, ...product.items]
				}
			})

			// 3. Remover SKUs duplicados dentro de cada produto
			const groupedProducts = Array.from(productMap.values()).map(product => {
				const uniqueItems = Array.from(new Map(product.items.map(item => [item.itemId, item])).values())

				return {
					...product,
					items: uniqueItems
				}
			})

			setRecommendationProducts(groupedProducts)

			return groupedProducts
		} catch (e) {
			console.error('loadRecommendationProducts: Error', e)
		} finally {
			setIsLoading(false)
		}
	}

	if ((!recommendationProducts || !recommendationProducts?.length) && !isLoading) return null

	return (
		<View className='py-[30px] px-4 bg-white flex flex-col gap-5'>
			<View className='px-4'>
				<Text className='text-xl font-semibold tracking-[0.4px] uppercase text-brown-500'>
					{t('productBasicTemplate.txtWhoSaw', 'Você pode gostar')}
				</Text>
			</View>

			{isLoading ? (
				<View className='flex gap-4 px-4 py-2 overflow-x-auto'>
					<View className='mt-2 min-w-[50vw] h-[320px] bg-gray-200 rounded animate-pulse' />
					<View className='mt-2 min-w-[50vw] h-[320px] bg-gray-200 rounded animate-pulse' />
					<View className='mt-2 min-w-[50vw] h-[320px] bg-gray-200 rounded animate-pulse' />
				</View>
			) : (
				<ShelfOfProductsCarousel
					isLoading={isLoading}
					products={recommendationProducts}
					gap={16}
				/>
			)}

			<BottomInset />
			<BottomInset />
		</View>
	)
}
