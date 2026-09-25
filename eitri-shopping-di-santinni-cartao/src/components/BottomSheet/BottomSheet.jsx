import { useState, useEffect } from 'react'
import { BottomInset } from 'eitri-shopping-di-santinni-shared'

const ANIMATION_DURATION = 300

export default function BottomSheet(props) {
	const { show, onClose, children, className = 'bg-white' } = props

	const [visible, setVisible] = useState(false)
	const [entered, setEntered] = useState(false)

	useEffect(() => {
		if (show) {
			setVisible(true)

			const enterTimer = setTimeout(() => setEntered(true), 20)

			return () => clearTimeout(enterTimer)
		}

		setEntered(false)

		const exitTimer = setTimeout(() => setVisible(false), ANIMATION_DURATION)

		return () => clearTimeout(exitTimer)
	}, [show])

	if (!visible) return null

	return (
		<View
			className='fixed inset-0 z-[9999] flex items-end !bg-black/60 !opacity-100'
			onClick={onClose}>
			<View
				className={`w-full px-4 pt-4 rounded-t-2xl ${className} transition-transform duration-300 ease-out ${entered ? 'translate-y-0' : 'translate-y-full'}`}
				onClick={event => event?.stopPropagation?.()}>
				{children}

				<BottomInset />
			</View>
		</View>
	)
}
