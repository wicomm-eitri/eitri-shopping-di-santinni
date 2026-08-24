import { useRef } from 'react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

const CIRCLE_SIZE = 48
const GAP = 12

export default function CategorySizeSwipe({ items, onItemClick }) {
	const scrollRef = useRef(null)

	const hasMultipleItems = items?.length > 4
	const step = CIRCLE_SIZE + GAP

	const getScrollElement = () => {
		if (!scrollRef.current) return null

		return typeof scrollRef.current.getViewElement === 'function'
			? scrollRef.current.getViewElement()
			: scrollRef.current
	}

	const goToSlide = direction => {
		const element = getScrollElement()

		if (!element) return

		const maxScrollLeft = element.scrollWidth - element.clientWidth

		if (direction === 'right') {
			const nextScrollLeft = element.scrollLeft + step

			element.scrollTo({
				left: nextScrollLeft >= maxScrollLeft - 1 ? 0 : nextScrollLeft,
				behavior: 'smooth'
			})
		} else {
			const prevScrollLeft = element.scrollLeft - step

			element.scrollTo({
				left: prevScrollLeft <= 0 ? maxScrollLeft : prevScrollLeft,
				behavior: 'smooth'
			})
		}
	}

	return (
		<View className='relative'>
			<View
				ref={scrollRef}
				className='flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar'>
				{items?.map((subItem, index) => (
					<View
						key={`${subItem.title}-${index}`}
						onClick={() => onItemClick(subItem)}
						style={{ width: `${CIRCLE_SIZE}px`, height: `${CIRCLE_SIZE}px` }}
						className='flex items-center justify-center shrink-0 snap-start rounded-full border-[1.5px] border-red-700 bg-white transition-opacity active:opacity-70'>
						<Text className='font-semibold text-sm text-red-700'>{subItem.title}</Text>
					</View>
				))}
			</View>

			{hasMultipleItems && (
				<>
					<View
						className='absolute -left-5 top-1/2 -translate-y-1/2 z-10'
						onClick={() => goToSlide('left')}>
						<View className='w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center'>
							<LuChevronLeft className='text-red-700 text-sm' />
						</View>
					</View>

					<View
						className='absolute -right-5 top-1/2 -translate-y-1/2 z-10'
						onClick={() => goToSlide('right')}>
						<View className='w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center'>
							<LuChevronRight className='text-red-700 text-sm' />
						</View>
					</View>
				</>
			)}
		</View>
	)
}
