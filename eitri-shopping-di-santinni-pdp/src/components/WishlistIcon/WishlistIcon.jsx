export default function WishlistIcon(props) {
	const { filled, className, size } = props

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={size || '24'}
			height={size || '24'}
			viewBox='0 0 25 25'
			strokeWidth='2'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className || 'text-[#C8102E]'}
			fill={filled ? 'currentColor' : 'none'}>
			<path
				d='M11.922 21.625L3.72515 13.0896C1.41682 10.6854 1.56265 6.74374 4.04182 4.53124C6.50119 2.33645 10.2304 2.76249 12.1741 5.46145L12.5012 5.91458L12.8283 5.46145C14.772 2.76249 18.5012 2.33645 20.9606 4.53124C23.4397 6.74479 23.5856 10.6875 21.2762 13.0906L13.0783 21.6271C13.004 21.7057 12.9144 21.7683 12.8151 21.8111C12.7158 21.8538 12.6088 21.8759 12.5007 21.8759C12.3925 21.8759 12.2855 21.8538 12.1862 21.8111C12.0869 21.7683 11.9974 21.7057 11.9231 21.6271L11.922 21.625Z'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}
