import { useState, useEffect } from 'react'
import { View, Text } from 'eitri-luminus'
import { getProductsService } from '../../../services/ProductService'
import ShelfOfProducts from '../../ShelfOfProducts/ShelfOfProducts'

export default function ProductTiles(props) {
	const { data } = props
	const [shelves, setShelves] = useState([])
	const [currentShelf, setCurrentShelf] = useState({})
	const [currentProducts, setCurrentProducts] = useState([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [cachedProducts, setCachedProducts] = useState({})

	useEffect(() => {
		if (data?.shelves) {
			setShelves(data.shelves)
			setCurrentShelf(data.shelves[0])
		}
	}, [data])

	useEffect(() => {
		if (currentShelf?.title) {
			executeProductSearch(currentShelf)
		}
	}, [currentShelf])

	const executeProductSearch = async shelf => {
		try {
			setIsLoadingProducts(true)

			if (cachedProducts[shelf.title]) {
				setCurrentProducts(cachedProducts[shelf.title])

				return
			}

			const params = {
				facets: shelf.facets || [],
				query: shelf.term ?? '',
				sort: shelf.sort ?? '',
				to: shelf.numberOfItems || 8
			}

			const result = await getProductsService(params)

			if (result?.products) {
				setCurrentProducts(result.products)
				setCachedProducts({
					...cachedProducts,
					[shelf.title]: result.products
				})
			}
		} catch (e) {
			console.error('executeProductSearch.error', e)
		} finally {
			setIsLoadingProducts(false)
		}
	}

	const onChooseShelf = shelf => setCurrentShelf(structuredClone(shelf))

	const paramsObject = Object.fromEntries((data?.params || []).map(item => [item.key, item.value]))

	return (
		<View className='py-2'>
			{data?.title && (
				<View className='px-4 pb-3'>
					<Text className='font-bold text-lg  uppercase'>{data?.title}</Text>
				</View>
			)}

			<View className='px-4 mb-4'>
				{/* Scroll wrapper separado da borda para não cortar a linha vermelha */}
				<View className='overflow-x-auto hide-scrollbar'>
					<View className='flex flex-row gap-6 border-b-[2px] border-white'>
						{shelves?.map(shelf => {
							const isActive = shelf.title === currentShelf.title

							return (
								<View
									key={shelf.title}
									onClick={() => onChooseShelf(shelf)}
									className={`pb-2 min-w-fit  transition-all border-b-[2px]`}
									style={{
										borderColor: isActive ? '#DC2626' : 'transparent',
										marginBottom: -2
									}}>
									<Text
										className={`text-sm tracking-wide uppercase ${
											isActive ? 'text-red-600 font-bold' : 'text-gray-700 font-medium'
										}`}>
										{shelf.title}
									</Text>
								</View>
							)
						})}
					</View>
				</View>
			</View>

			{currentProducts.length > 0 ? (
				<ShelfOfProducts
					mode={data.mode || 'scroll'}
					isLoading={isLoadingProducts}
					products={currentProducts}
					params={paramsObject}
				/>
			) : (
				<View className='flex w-full items-center justify-center gap-4 py-2 mt-2'>
					<Skeleton className='w-[150px] h-[300px] bg-gray-200 rounded animate-pulse' />
					<Skeleton className='w-[150px] h-[300px] bg-gray-200 rounded animate-pulse' />
				</View>
			)}
		</View>
	)
}
