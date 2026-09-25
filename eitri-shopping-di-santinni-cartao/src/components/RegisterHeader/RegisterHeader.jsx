import { useState } from 'react'
import { closeRegister } from '../../services/NavigationService'
import CancelRegisterModal from '../CancelRegisterModal/CancelRegisterModal'
import CardHeader from '../CardHeader/CardHeader'

export default function RegisterHeader(props) {
	const { onBack } = props

	const [showCancelModal, setShowCancelModal] = useState(false)

	return (
		<>
			<CardHeader
				onBack={onBack}
				onClose={() => setShowCancelModal(true)}
			/>

			<CancelRegisterModal
				show={showCancelModal}
				onCancel={closeRegister}
				onContinue={() => setShowCancelModal(false)}
			/>
		</>
	)
}
