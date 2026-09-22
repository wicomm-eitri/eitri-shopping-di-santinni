import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton, Loading } from 'eitri-shopping-di-santinni-shared'
import Alert from '../components/Alert/Alert'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import { navigate, PAGES } from '../services/NavigationService'
import FaceFrameIcon from '../assets/icons/face-frame.svg'

const PHOTO_TIPS = [
	{ title: 'Remova acessórios', description: 'Boné, brinco ou quaisquer outros' },
	{ title: 'Não sorria', description: 'Mantenha-se sério' },
	{ title: 'Siga o exemplo', description: 'Enquadre o rosto na moldura' }
]

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

			<View className='flex flex-col gap-[30px] px-4 pt-6 bg-snow'>
				<LoanProgress currentStep={9} />

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Confirmar identidade
				</Text>

				<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
					Tire uma foto para confirmar sua identidade
				</Text>

				<View className='flex flex-col items-center justify-center'>
					<Image
						src={FaceFrameIcon}
						alt=''
						className='w-[153px] h-[153px]'
					/>
				</View>

				<View className='flex flex-col gap-3'>
					{PHOTO_TIPS.map((tip, index) => (
						<PhotoTip
							key={tip.title}
							number={index + 1}
							tip={tip}
						/>
					))}
				</View>

				<CustomButton
					label='Tirar foto'
					disabled={loading}
					className='!h-[34px] text-xs uppercase tracking-[0.24px]'
					onPress={onPressTakePhoto}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}

function PhotoTip(props) {
	const { number, tip } = props

	return (
		<View className='flex items-center gap-[15px]'>
			<View className='flex items-center justify-center shrink-0 w-[42px] h-11 rounded-full bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] text-center bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent'>
					{number}
				</Text>
			</View>

			<View className='flex flex-col gap-1'>
				<Text className='text-xs font-semibold leading-5 tracking-[0.24px] text-[#0C0C0C]'>{tip.title}</Text>

				<Text className='text-xs leading-5 tracking-[0.24px] text-[#0C0C0C]'>{tip.description}</Text>
			</View>
		</View>
	)
}
