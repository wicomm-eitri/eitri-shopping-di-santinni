import { View } from 'eitri-luminus'

// Medidas do arco exportado do Figma (201 x 167)
const WIDTH = 202
const HEIGHT = 170
const CENTER = 100.64
const RADIUS = 96.4
const STROKE_WIDTH = 8.4
const DOT_RADIUS = 3.5
// Ângulo das pontas do arco, medido a partir do topo no sentido horário
const END_ANGLE = 129.8
const SWEEP = END_ANGLE * 2

const pointAt = angle => {
	const radians = (angle * Math.PI) / 180

	return {
		x: CENTER + RADIUS * Math.sin(radians),
		y: CENTER - RADIUS * Math.cos(radians)
	}
}

const getUsedRatio = (invoice, availableLimit) => {
	const used = Math.max(Number(invoice) || 0, 0)
	const available = Math.max(Number(availableLimit) || 0, 0)
	const total = used + available

	if (!total) return 0

	return Math.min(used / total, 1)
}

export default function InvoiceGauge(props) {
	const { invoice, availableLimit, children } = props

	const usedRatio = getUsedRatio(invoice, availableLimit)

	const start = pointAt(-END_ANGLE)
	const end = pointAt(END_ANGLE)
	const dot = pointAt(-END_ANGLE + SWEEP * usedRatio)

	const arcPath = `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 1 1 ${end.x} ${end.y}`

	const availablePercent = (1 - usedRatio) * 100
	const usedPercent = usedRatio * 100

	return (
		<View className='relative w-[202px] h-[170px]'>
			<svg
				width={WIDTH}
				height={HEIGHT}
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				{/* Parte usada do limite (fatura) */}
				<path
					d={arcPath}
					pathLength='100'
					strokeWidth={STROKE_WIDTH}
					strokeLinecap='round'
					className='stroke-base-100 opacity-30'
				/>

				{/* Limite disponível */}
				{availablePercent > 0 && (
					<path
						d={arcPath}
						pathLength='100'
						strokeWidth={STROKE_WIDTH}
						strokeLinecap='round'
						strokeDasharray={`${availablePercent} 100`}
						strokeDashoffset={-usedPercent}
						className='stroke-base-100 transition-all duration-500'
					/>
				)}

				<circle
					cx={dot.x}
					cy={dot.y}
					r={DOT_RADIUS}
					className='fill-red-700 transition-all duration-500'
				/>
			</svg>

			<View className='absolute inset-0'>{children}</View>
		</View>
	)
}
