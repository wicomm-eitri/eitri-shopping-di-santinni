import { useState, useEffect } from 'react'
import { getProductsService } from '../../../services/ProductService'
import ShelfOfProducts from '../../ShelfOfProducts/ShelfOfProducts'

export default function ProductTilesHighlights(props) {
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

	const handleBannerClick = action => {
		if (!action || action.type === 'none') return
		console.log('Navegar para:', action)
	}

	const bgColor = data?.backgroundColor || '#C8102E'
	const textColor = data?.textColor || '#FFFFFF'

	return (
		<View
			style={{ backgroundColor: bgColor }}
			className='py-4 mt-1 mb-[35px]'>
			{data?.title && (
				<View className='px-4 pb-2'>
					<Text className='font-semibold text-2xl uppercase text-[#FAFAF8]'>{data?.title}</Text>
				</View>
			)}

			<View className='relative mb-6'>
				<View className='absolute bottom-0 left-4 right-4 h-[2px] bg-[#FFFFFF]' />

				<View className='flex overflow-x-auto px-4 gap-6 relative z-10 hide-scrollbar'>
					{shelves?.map(shelf => {
						const isActive = shelf.title === currentShelf.title
						return (
							<View
								key={shelf.title}
								onClick={() => onChooseShelf(shelf)}
								className='pb-2 min-w-fit cursor-pointer transition-all'
								style={{
									borderBottomWidth: '2px',
									borderBottomStyle: 'solid',
									borderBottomColor: isActive ? '#2C2C2C' : 'transparent'
								}}>
								<Text
									style={{ color: '#FAFAF8', opacity: isActive ? 1 : 0.85 }}
									className={`uppercase whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}>
									{shelf.title}
								</Text>
							</View>
						)
					})}
				</View>
			</View>

			{currentShelf?.highlightImage && (
				<View
					className='px-4 mb-4 '
					onClick={() => handleBannerClick(currentShelf?.highlightAction)}>
					<Image
						src={currentShelf.highlightImage}
						alt={currentShelf.title}
						className='w-full object-cover rounded-xl'
					/>
				</View>
			)}
			{currentProducts.length > 0 ? (
				<ShelfOfProducts
					mode={data.mode || 'scroll'}
					isLoading={isLoadingProducts}
					products={currentProducts}
					params={paramsObject}
				/>
			) : (
				<View className='flex overflow-x-auto gap-2 px-4 py-2 mt-2'>
					<Skeleton className='min-w-[48vw] min-h-[370px] bg-gray-200 rounded animate-pulse' />
					<Skeleton className='min-w-[48vw] min-h-[370px] bg-gray-200 rounded animate-pulse' />
					<Skeleton className='min-w-[48vw] min-h-[370px] bg-gray-200 rounded animate-pulse' />
				</View>
			)}
		</View>
	)
}
