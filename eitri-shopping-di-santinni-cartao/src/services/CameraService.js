import Eitri from 'eitri-bifrost'

export const CAMERA_ERRORS = {
	PERMISSION_DENIED: 'PERMISSION_DENIED',
	PERMISSION_BLOCKED: 'PERMISSION_BLOCKED',
	CAPTURE_FAILED: 'CAPTURE_FAILED'
}

const PERMISSION_GRANTED = 'GRANTED'

const PERMISSION_BLOCKED = 'BLOCKED'

const OPEN_APP_SETTINGS_API_LEVEL = 9

const permissionStatus = response => String(response?.status || '').toUpperCase()

const openAppSettings = async () => {
	if (!Eitri.canIUse(OPEN_APP_SETTINGS_API_LEVEL)) return

	try {
		await Eitri.system.openAppSettings()
	} catch (e) {
		console.error('openAppSettings error:', e)
	}
}

// Retorna o erro de permissão (ou null quando concedida). Se estiver bloqueada, abre as configurações do aparelho
const requestCameraPermission = async () => {
	let status = permissionStatus(await Eitri.camera.checkPermission())

	if (status === PERMISSION_GRANTED) return null

	if (status !== PERMISSION_BLOCKED) {
		status = permissionStatus(await Eitri.camera.requestPermission())

		if (status === PERMISSION_GRANTED) return null
	}

	if (status === PERMISSION_BLOCKED) {
		await openAppSettings()

		return CAMERA_ERRORS.PERMISSION_BLOCKED
	}

	return CAMERA_ERRORS.PERMISSION_DENIED
}

// Converte a foto (EitriFile) em um data URI para ser exibido em um Image
export const toImageSource = async picture => {
	const base64 = await picture.toBase64()

	if (base64.startsWith('data:')) return base64

	return `data:${picture.mimeType || 'image/jpeg'};base64,${base64}`
}

// Retorna { picture } em caso de sucesso ou { error } com um dos CAMERA_ERRORS
export const takePicture = async (options = { quality: 0.8 }) => {
	try {
		const permissionError = await requestCameraPermission()

		if (permissionError) return { error: permissionError }

		const picture = await Eitri.camera.takePicture(options)

		if (!picture) return { error: CAMERA_ERRORS.CAPTURE_FAILED }

		return { picture }
	} catch (e) {
		console.error('takePicture error:', e)

		return { error: CAMERA_ERRORS.CAPTURE_FAILED }
	}
}
