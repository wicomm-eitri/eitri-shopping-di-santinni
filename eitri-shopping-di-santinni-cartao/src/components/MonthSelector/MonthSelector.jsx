import { useEffect } from 'react'
import { View, Text, Image } from 'eitri-luminus'
import ChevronIcon from '../../assets/icons/chevron-left.svg'

export const MONTHS = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro'
]

const SCROLL_ID = 'month-selector-scroll'

export default function MonthSelector(props) {
	const { selectedMonth, onChange } = props

	useEffect(() => {
		centerSelectedMonth()
	}, [selectedMonth])

	const centerSelectedMonth = () => {
		const container = document.getElementById(SCROLL_ID)
		const monthElement = document.getElementById(`month-selector-${selectedMonth}`)

		if (!container || !monthElement) return

		container.scrollTo({
			left: monthElement.offsetLeft - container.clientWidth / 2 + monthElement.clientWidth / 2,
			behavior: 'smooth'
		})
	}

	const onPressPrevious = () => {
		if (selectedMonth > 0) onChange(selectedMonth - 1)
	}

	const onPressNext = () => {
		if (selectedMonth < MONTHS.length - 1) onChange(selectedMonth + 1)
	}

	return (
		<View className='relative w-full h-[47px] overflow-hidden rounded-lg bg-[#FAFAF8] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)]'>
			<View
				id={SCROLL_ID}
				className='relative flex items-center gap-[50px] h-full px-[70px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
				{MONTHS.map((month, index) => (
					<View
						key={month}
						id={`month-selector-${index}`}
						className='flex flex-col items-center gap-2 shrink-0 pt-[9px]'
						onClick={() => onChange(index)}>
						<Text className='text-sm font-semibold leading-[10px] tracking-[0.28px] whitespace-nowrap text-black'>
							{month}
						</Text>

						<View
							className={`w-[50px] h-px rounded-[5px] ${selectedMonth === index ? 'bg-black' : 'bg-transparent'}`}
						/>
					</View>
				))}
			</View>

			<View className='absolute top-0 left-0 w-[70px] h-full pointer-events-none bg-gradient-to-r from-white to-transparent' />
			<View className='absolute top-0 right-0 w-[70px] h-full pointer-events-none bg-gradient-to-l from-white to-transparent' />

			<View
				className='absolute left-1 top-1/2 -translate-y-1/2'
				onClick={onPressPrevious}>
				<Image
					src={ChevronIcon}
					alt='Mês anterior'
					className='w-5 h-5'
				/>
			</View>

			<View
				className='absolute right-1 top-1/2 -translate-y-1/2'
				onClick={onPressNext}>
				<Image
					src={ChevronIcon}
					alt='Próximo mês'
					className='w-5 h-5 rotate-180'
				/>
			</View>
		</View>
	)
}
