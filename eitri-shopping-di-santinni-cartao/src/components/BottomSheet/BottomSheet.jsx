import { useEffect, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { createPortal } from 'react-dom'

const TRANSITION_MS = 300

export default function BottomSheet(props) {
	const { show, onClose, children, closeOnBackdrop = true, className = '' } = props

	const [mounted, setMounted] = useState(false)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		let transitionTimer

		if (show) {
			setMounted(true)
			// Aguarda o mount para que a transição de translate-y-full -> translate-y-0 aconteça
			transitionTimer = setTimeout(() => setVisible(true), 50)
		} else if (mounted) {
			setVisible(false)
			transitionTimer = setTimeout(() => setMounted(false), TRANSITION_MS)
		}

		return () => clearTimeout(transitionTimer)
	}, [show])

	useEffect(() => {
		try {
			if (show) {
				Eitri.bottomBar.hide()
			} else {
				Eitri.bottomBar.show()
			}
		} catch (error) {
			console.error('Error updating bottom bar visibility', error)
		}

		return () => {
			if (!show) return

			try {
				Eitri.bottomBar.show()
			} catch (error) {
				console.error('Error restoring bottom bar visibility', error)
			}
		}
	}, [show])

	const handleBackdropClick = () => {
		if (closeOnBackdrop && typeof onClose === 'function') {
			onClose()
		}
	}

	if (!mounted) return null

	const sheet = (
		<View
			className={`fixed inset-0 z-[99999] flex items-end justify-center overflow-hidden bg-black transition-opacity duration-300 ease-out ${visible ? 'bg-opacity-50' : 'bg-opacity-0'}`}>
			<View
				onClick={handleBackdropClick}
				className='absolute inset-0'
			/>

			<View
				className={`relative flex flex-col w-full max-h-[85vh] overflow-y-auto bg-white rounded-t-[24px] transition-transform duration-300 ease-out ${visible ? 'translate-y-0' : 'translate-y-full'} ${className}`}>
				{children}
			</View>
		</View>
	)

	return typeof document !== 'undefined' ? createPortal(sheet, document.body) : null
}
