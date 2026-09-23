import CardsIcon from '../../assets/icons/cards.svg'

const SIZE = 60
const STROKE_WIDTH = 6
const CENTER = SIZE / 2
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function LimitRing(props) {
	const { usedRatio = 0 } = props

	const ratio = Math.min(Math.max(Number(usedRatio) || 0, 0), 1)

	return (
		<View className='relative shrink-0 w-[60px] h-[60px]'>
			<svg
				width={SIZE}
				height={SIZE}
				viewBox={`0 0 ${SIZE} ${SIZE}`}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<circle
					cx={CENTER}
					cy={CENTER}
					r={RADIUS}
					strokeWidth={STROKE_WIDTH}
					className='stroke-[#D9D9D9]'
				/>

				{ratio > 0 && (
					<circle
						cx={CENTER}
						cy={CENTER}
						r={RADIUS}
						strokeWidth={STROKE_WIDTH}
						strokeLinecap='round'
						strokeDasharray={`${CIRCUMFERENCE * ratio} ${CIRCUMFERENCE}`}
						transform={`rotate(-90 ${CENTER} ${CENTER})`}
						className='stroke-[#C8102E]'
					/>
				)}
			</svg>

			<View className='absolute inset-0 flex items-center justify-center'>
				<Image
					src={CardsIcon}
					alt=''
					className='w-6 h-6'
				/>
			</View>
		</View>
	)
}
