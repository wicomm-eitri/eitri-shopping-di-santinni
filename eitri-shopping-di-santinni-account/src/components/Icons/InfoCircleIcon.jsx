export default function InfoCircleIcon({ color = '#555555', width = 12, height = 12, className = '' }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={width}
			height={height}
			viewBox='0 0 12 12'
			fill='none'
			className={className}>
			<circle
				cx='6'
				cy='6'
				r='5.5'
				stroke={color}
			/>
			<path
				d='M5.99512 3.5V8.5M8.5 5.99593L3.5 5.99593'
				stroke={color}
				strokeLinecap='round'
			/>
		</svg>
	)
}
