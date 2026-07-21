import { useState } from 'react'
import { CustomCarousel } from 'eitri-shopping-di-santinni-shared'
import ProductCard from '../../ProductCard/ProductCard'

export default function ShelfOfProductsCarousel(props) {
	const { isLoading, products, paddingLeft } = props

	const [currentSlide, setCurrentSlide] = useState(0)
	const productsList = Array.isArray(products) ? products : []

	const handleScroll = e => setCurrentSlide(e)

	return (
		<>
			{isLoading ? (
				<View className='flex overflow-x-auto gap-2 px-4 py-2 mt-2'>
					<View className='min-w-[50vw] h-[370px] bg-gray-200 rounded animate-pulse' />
					<View className='min-w-[50vw] h-[370px] bg-gray-200 rounded animate-pulse' />
					<View className='min-w-[50vw] h-[370px] bg-gray-200 rounded animate-pulse' />
				</View>
			) : (
				<>
					<CustomCarousel
						autoPlay={false}
						loop={true}
						onSlideChange={handleScroll}
						paddingLeft={paddingLeft}
						slidesToShow={2}>
						{productsList.map((product, index) => (
							<View
								key={`${product?.productId ?? index}-${index}`}
								className='flex justify-center py-2 h-full'>
								<ProductCard
									product={product}
									className='w-full'
									openModal={props.openModal}
								/>
							</View>
						))}
					</CustomCarousel>

					{productsList.length > 1 && (
						<View className='flex justify-center items-center gap-1 mt-2'>
							{productsList.map((_, index) => (
								<View
									key={index}
									className={`${currentSlide === index ? 'bg-red-700' : 'bg-white'} w-3 h-3 rounded-full transition-[width,background-color] duration-300 ease-in-out`}
								/>
							))}
						</View>
					)}
				</>
			)}
		</>
	)
}
