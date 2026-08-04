export default function StepCurrentIcon({ color = '#8BC34A', width = 14, height = 14, className = '' }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={width}
			height={height}
			viewBox='0 0 14 14'
			fill='none'
			className={className}>
			<circle
				cx='7'
				cy='7'
				r='5'
				fill={color}
			/>
			<circle
				cx='7'
				cy='7'
				r='6.5'
				stroke={color}
			/>
		</svg>
	)
}
