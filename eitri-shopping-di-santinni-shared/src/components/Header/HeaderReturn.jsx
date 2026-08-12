import Eitri from 'eitri-bifrost'

export default function HeaderReturn(props) {
	const { backPage, onClick, className } = props

	const onBack = () => {
		if (typeof onClick === 'function') {
			return onClick()
		} else {
			if (backPage) {
				Eitri.navigation.back(backPage)
			} else {
				Eitri.navigation.back()
			}
		}
	}

	return (
		<View
			className={`flex items-center justify-center p-[18px] m-[-18px] ${className}`}
			onClick={onBack}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='7'
				height='12'
				viewBox='0 0 7 12'
				fill='none'>
				<path
					d='M6 11L1 6L6 1'
					stroke='#2C2C2C'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				/>
			</svg>
		</View>
	)
}
