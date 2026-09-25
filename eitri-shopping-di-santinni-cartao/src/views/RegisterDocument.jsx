import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton, Loading } from 'eitri-shopping-di-santinni-shared'
import DocumentLockIcon from '../assets/icons/document-lock.svg'
import Alert from '../components/Alert/Alert'
import PhotoTip from '../components/IdentityPhoto/components/PhotoTip'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import RegisterHeader from '../components/RegisterHeader/RegisterHeader'
import SelectField from '../components/SelectField/SelectField'
import { CAMERA_ERRORS, takePicture } from '../services/CameraService'
import { navigate, PAGES } from '../services/NavigationService'
import { DOCUMENT_TYPES, validateDocument } from '../services/RegisterService'
import { REGISTER_TOTAL_STEPS } from '../utils/utils'

const DOCUMENTS = [
	{ value: DOCUMENT_TYPES.RG, key: 'rg', label: 'RG' },
	{ value: DOCUMENT_TYPES.CNH, key: 'cnh', label: 'CNH' }
]

const DOCUMENT_TIPS = [
	{ id: 'twoPhotos', description: 'São apenas duas fotos, frente e verso do seu documento' },
	{ id: 'removePlastic', description: 'Retire o documento do plástico' },
	{ id: 'wholeDocument', description: 'Atenção para não cortar nenhuma parte do documento. Precisamos vê-lo por inteiro' }
]

const ERROR_MESSAGES = {
	[CAMERA_ERRORS.PERMISSION_DENIED]: {
		key: 'registerDocument.errors.permissionDenied',
		fallback: 'Precisamos da câmera para fotografar seu documento'
	},
	[CAMERA_ERRORS.PERMISSION_BLOCKED]: {
		key: 'registerDocument.errors.permissionBlocked',
		fallback: 'Libere o acesso à câmera nas configurações do aparelho'
	},
	[CAMERA_ERRORS.CAPTURE_FAILED]: {
		key: 'registerDocument.errors.captureFailed',
		fallback: 'Não foi possível tirar a foto. Tente novamente'
	}
}

export default function RegisterDocument() {
	const { t } = useTranslation()

	const [documentType, setDocumentType] = useState('')
	const [front, setFront] = useState(null)
	const [loading, setLoading] = useState(false)
	const [alertState, setAlertState] = useState({ show: false, message: '', type: 'negative' })

	const onBack = () => Eitri.navigation.back()

	const showAlert = (message, type = 'negative') => setAlertState({ show: true, message, type })

	const showError = error => showAlert(t(ERROR_MESSAGES[error].key, ERROR_MESSAGES[error].fallback))

	// Trocar o documento descarta a frente já fotografada
	const onChangeDocument = value => {
		setDocumentType(value)
		setFront(null)
	}

	const onValidateDocument = async back => {
		try {
			await validateDocument(documentType, front, back)
		} catch (e) {
			console.error('validateDocument error:', e)
			setFront(null)
			showAlert(t('registerDocument.errors.invalidDocument', 'Não foi possível validar o documento. Tire as fotos novamente'))

			return
		}

		navigate(PAGES.REGISTER_PERSONAL_DETAILS)
	}

	// A primeira foto é a frente do documento e a segunda, o verso
	const onPressTakePhoto = async () => {
		if (loading || !documentType) return

		setLoading(true)

		try {
			const { picture, error } = await takePicture()

			if (error) {
				showError(error)

				return
			}

			if (!front) {
				setFront(picture)
				showAlert(t('registerDocument.frontCaptured', 'Frente registrada! Agora tire a foto do verso'), 'positive')

				return
			}

			await onValidateDocument(picture)
		} finally {
			setLoading(false)
		}
	}

	const buttonLabel = !documentType
		? t('registerDocument.takePhoto', 'Tirar foto')
		: front
			? t('registerDocument.takeBackPhoto', 'Tirar foto do verso')
			: t('registerDocument.takeFrontPhoto', 'Tirar foto da frente')

	return (
		<Page
			title={t('registerDocument.pageTitle', 'Foto do Documento - Cartão Di Santinni')}
			statusBarTextColor='black'>
			<RegisterHeader onBack={onBack} />

			<Loading
				isLoading={loading}
				fullScreen={true}
			/>

			<Alert
				show={alertState.show}
				message={alertState.message}
				type={alertState.type}
				onDismiss={() => setAlertState(current => ({ ...current, show: false }))}
			/>

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress
					currentStep={5}
					totalSteps={REGISTER_TOTAL_STEPS}
				/>

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('registerDocument.title', 'Foto do Documento')}
				</Text>

				<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
					{t('registerDocument.subtitle', 'Agora precisamos que tire fotos do documento selecionado')}
				</Text>

				<View className='flex flex-col items-center justify-center'>
					<Image
						src={DocumentLockIcon}
						alt=''
						className='w-[153px] h-[153px]'
					/>
				</View>

				<View className='flex flex-col gap-3'>
					{DOCUMENT_TIPS.map((tip, index) => (
						<PhotoTip
							key={tip.id}
							number={index + 1}
							description={t(`registerDocument.tips.${tip.id}`, tip.description)}
						/>
					))}
				</View>

				<SelectField
					options={DOCUMENTS.map(option => ({
						value: option.value,
						label: t(`registerDocument.documents.${option.key}`, option.label)
					}))}
					value={documentType}
					placeholder={t('registerDocument.documentPlaceholder', 'Selecionar Opção')}
					onChange={onChangeDocument}
				/>

				<CustomButton
					label={buttonLabel}
					disabled={!documentType || loading}
					className='!h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressTakePhoto}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}
