export default function StepDoneIcon({ color = '#8BC34A', width = 10, height = 10, className = '' }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={width}
			height={height}
			viewBox='0 0 10 10'
			fill='none'
			className={className}>
			<circle
				cx='5'
				cy='5'
				r='5'
				fill={color}
			/>
		</svg>
	)
}
