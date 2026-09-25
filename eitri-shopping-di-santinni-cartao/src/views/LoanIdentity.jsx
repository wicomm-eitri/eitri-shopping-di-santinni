import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Page } from 'eitri-luminus'
import { Loading } from 'eitri-shopping-di-santinni-shared'
import Alert from '../components/Alert/Alert'
import CardHeader from '../components/CardHeader/CardHeader'
import IdentityPhoto from '../components/IdentityPhoto/IdentityPhoto'
import { CAMERA_ERRORS, takePicture } from '../services/CameraService'
import { navigate, PAGES } from '../services/NavigationService'

const ERROR_MESSAGES = {
	[CAMERA_ERRORS.PERMISSION_DENIED]: 'Precisamos da câmera para confirmar sua identidade',
	[CAMERA_ERRORS.PERMISSION_BLOCKED]: 'Libere o acesso à câmera nas configurações do aparelho',
	[CAMERA_ERRORS.CAPTURE_FAILED]: 'Não foi possível tirar a foto. Tente novamente'
}

export default function LoanIdentity(props) {
	const loan = props?.location?.state?.loan || {}

	const [loading, setLoading] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')
	const [showAlert, setShowAlert] = useState(false)

	const onBack = () => Eitri.navigation.back()

	const showError = message => {
		setAlertMessage(message)
		setShowAlert(true)
	}

	// TODO: enviar a selfie para a API de biometria antes de concluir o empréstimo
	const onPressTakePhoto = async () => {
		if (loading) return

		setLoading(true)

		const { error } = await takePicture()

		setLoading(false)

		if (error) {
			showError(ERROR_MESSAGES[error])

			return
		}

		navigate(PAGES.LOAN_COMPLETED, { loan })
	}

	return (
		<Page
			title='Confirmar identidade - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={loading}
				fullScreen={true}
			/>

			<Alert
				show={showAlert}
				message={alertMessage}
				onDismiss={() => setShowAlert(false)}
			/>

			<IdentityPhoto
				currentStep={9}
				buttonLabel='Tirar foto'
				loading={loading}
				onPressAction={onPressTakePhoto}
			/>
		</Page>
	)
}
