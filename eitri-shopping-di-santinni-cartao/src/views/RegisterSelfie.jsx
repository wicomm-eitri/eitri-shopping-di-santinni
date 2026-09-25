import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton, Loading } from 'eitri-shopping-di-santinni-shared'
import SelfieFrame from '../assets/images/selfie-frame.svg'
import Alert from '../components/Alert/Alert'
import RegisterHeader from '../components/RegisterHeader/RegisterHeader'
import { CAMERA_ERRORS, takePicture, toImageSource } from '../services/CameraService'
import { navigate, PAGES } from '../services/NavigationService'
import { validateSelfie } from '../services/RegisterService'

const ERROR_MESSAGES = {
	[CAMERA_ERRORS.PERMISSION_DENIED]: {
		key: 'registerSelfie.errors.permissionDenied',
		fallback: 'Precisamos da câmera para confirmar sua identidade'
	},
	[CAMERA_ERRORS.PERMISSION_BLOCKED]: {
		key: 'registerSelfie.errors.permissionBlocked',
		fallback: 'Libere o acesso à câmera nas configurações do aparelho'
	},
	[CAMERA_ERRORS.CAPTURE_FAILED]: {
		key: 'registerSelfie.errors.captureFailed',
		fallback: 'Não foi possível tirar a foto. Tente novamente'
	}
}

export default function RegisterSelfie() {
	const { t } = useTranslation()

	const [loading, setLoading] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')
	const [showAlert, setShowAlert] = useState(false)
	const [selfie, setSelfie] = useState('')

	const onBack = () => Eitri.navigation.back()

	const showMessage = message => {
		setAlertMessage(message)
		setShowAlert(true)
	}

	const showError = error => showMessage(t(ERROR_MESSAGES[error].key, ERROR_MESSAGES[error].fallback))

	const onValidateSelfie = async picture => {
		try {
			await validateSelfie(picture)

			navigate(PAGES.REGISTER_DOCUMENT)
		} catch (e) {
			console.error('validateSelfie error:', e)
			showMessage(t('registerSelfie.errors.invalidSelfie', 'Não foi possível validar sua selfie. Tente novamente'))
		}
	}

	const onPressTakePhoto = async () => {
		if (loading) return

		setLoading(true)

		try {
			const { picture, error } = await takePicture()

			if (error) {
				showError(error)

				return
			}

			setSelfie(await toImageSource(picture))

			await onValidateSelfie(picture)
		} catch (e) {
			console.error('onPressTakePhoto error:', e)
			showError(CAMERA_ERRORS.CAPTURE_FAILED)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Page
			title={t('registerSelfie.pageTitle', 'Selfie - Cartão Di Santinni')}
			statusBarTextColor='black'>
			<RegisterHeader onBack={onBack} />

			<Loading
				isLoading={loading}
				fullScreen={true}
			/>

			<Alert
				show={showAlert}
				message={alertMessage}
				onDismiss={() => setShowAlert(false)}
			/>

			<View className='flex flex-col items-center gap-[42px] px-4 pt-6 bg-snow'>
				<Text className='text-2xl font-semibold leading-8 tracking-[0.48px] text-center whitespace-pre-line bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('registerSelfie.title', 'Se prepare para\ntirar a Selfie')}
				</Text>

				<View className='w-[188px] h-[285px] rounded-[50%] overflow-hidden'>
					<Image
						src={selfie || SelfieFrame}
						alt=''
						className='w-full h-full object-cover'
					/>
				</View>

				<Text className='text-xl leading-8 tracking-[0.4px] text-center bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('registerSelfie.description', 'Enquadre seu rosto e pressione o botão “Tirar Foto”')}
				</Text>

				<CustomButton
					label={t('registerSelfie.takePhoto', 'Tirar foto')}
					disabled={loading}
					className='w-full !h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressTakePhoto}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}
