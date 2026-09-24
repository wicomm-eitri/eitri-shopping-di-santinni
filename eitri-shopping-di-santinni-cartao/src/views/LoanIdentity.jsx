import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Page } from 'eitri-luminus'
import { Loading } from 'eitri-shopping-di-santinni-shared'
import Alert from '../components/Alert/Alert'
import CardHeader from '../components/CardHeader/CardHeader'
import IdentityPhoto from '../components/IdentityPhoto/IdentityPhoto'
import { navigate, PAGES } from '../services/NavigationService'

const PERMISSION_MESSAGE = 'Precisamos da câmera para confirmar sua identidade'

const BLOCKED_MESSAGE = 'Libere o acesso à câmera nas configurações do aparelho'

const CAPTURE_MESSAGE = 'Não foi possível tirar a foto. Tente novamente'

const PERMISSION_GRANTED = 'GRANTED'

const PERMISSION_BLOCKED = 'BLOCKED'

const OPEN_APP_SETTINGS_API_LEVEL = 9

const permissionStatus = response => String(response?.status || '').toUpperCase()

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

	const openAppSettings = async () => {
		if (!Eitri.canIUse(OPEN_APP_SETTINGS_API_LEVEL)) return

		try {
			await Eitri.system.openAppSettings()
		} catch (e) {
			console.error('openAppSettings error:', e)
		}
	}

	const hasCameraPermission = async () => {
		let status = permissionStatus(await Eitri.camera.checkPermission())

		if (status === PERMISSION_GRANTED) return true

		if (status !== PERMISSION_BLOCKED) {
			status = permissionStatus(await Eitri.camera.requestPermission())

			if (status === PERMISSION_GRANTED) return true
		}

		if (status === PERMISSION_BLOCKED) {
			showError(BLOCKED_MESSAGE)
			await openAppSettings()
		} else {
			showError(PERMISSION_MESSAGE)
		}

		return false
	}

	// TODO: enviar a selfie para a API de biometria antes de concluir o empréstimo
	const onPressTakePhoto = async () => {
		if (loading) return

		setLoading(true)

		try {
			if (!(await hasCameraPermission())) return

			const picture = await Eitri.camera.takePicture({ quality: 0.8 })

			if (!picture) {
				showError(CAPTURE_MESSAGE)

				return
			}

			navigate(PAGES.LOAN_COMPLETED, { loan })
		} catch (e) {
			console.error('onPressTakePhoto error:', e)
			showError(CAPTURE_MESSAGE)
		} finally {
			setLoading(false)
		}
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
