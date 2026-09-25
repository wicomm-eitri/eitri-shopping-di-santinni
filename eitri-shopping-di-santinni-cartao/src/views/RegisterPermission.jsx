import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton } from 'eitri-shopping-di-santinni-shared'
import CardCheckbox from '../components/CardCheckbox/CardCheckbox'
import DocumentNotice from '../components/DocumentNotice/DocumentNotice'
import RegisterHeader from '../components/RegisterHeader/RegisterHeader'
import SecurityNotice from '../components/SecurityNotice/SecurityNotice'
import { navigate, PAGES } from '../services/NavigationService'

const GEOLOCATION_PERMISSION_INPUT = { precision: 'precise' }

const OPEN_APP_SETTINGS_API_LEVEL = 9

const PERMISSION_GRANTED = 'GRANTED'

const PERMISSION_BLOCKED = 'BLOCKED'

const permissionStatus = permission => String(permission?.status ?? '').toUpperCase()

export default function RegisterPermission() {
	const { t } = useTranslation()

	const [accepted, setAccepted] = useState(false)
	const [showDocumentNotice, setShowDocumentNotice] = useState(false)
	const [showSecurityNotice, setShowSecurityNotice] = useState(false)

	const onBack = () => Eitri.navigation.back()

	// TODO: definir destino (link/documento) do "Saiba mais"
	const onPressLearnMore = () => {}

	const goToNextStep = () => navigate(PAGES.REGISTER_CONTACT)

	const isGeolocationGranted = async () => {
		try {
			const permission = await Eitri.geolocation.checkPermission(GEOLOCATION_PERMISSION_INPUT)

			return permissionStatus(permission) === PERMISSION_GRANTED
		} catch (error) {
			console.warn('Não foi possível verificar a permissão de geolocalização', error)

			return true
		}
	}

	const openAppSettings = async () => {
		if (!Eitri.canIUse(OPEN_APP_SETTINGS_API_LEVEL)) return

		try {
			await Eitri.system.openAppSettings()
		} catch (error) {
			console.warn('Não foi possível abrir as configurações do app', error)
		}
	}

	// TODO: definir se a permissão de localização é obrigatória para seguir com o cadastro
	const requestGeolocationPermission = async () => {
		let status = ''

		try {
			status = permissionStatus(await Eitri.geolocation.requestPermission(GEOLOCATION_PERMISSION_INPUT))
		} catch (error) {
			console.warn('Não foi possível solicitar a permissão de geolocalização', error)
		}

		if (status === PERMISSION_BLOCKED) {
			await openAppSettings()
		}
	}

	const onPressContinue = () => setShowDocumentNotice(true)

	const onContinueDocumentNotice = async () => {
		setShowDocumentNotice(false)

		if (await isGeolocationGranted()) {
			goToNextStep()

			return
		}

		setShowSecurityNotice(true)
	}

	const onAgreeSecurityNotice = async () => {
		setShowSecurityNotice(false)

		await requestGeolocationPermission()

		goToNextStep()
	}

	return (
		<Page
			title={t('registerPermission.pageTitle', 'Uso dos Dados Pessoais - Cartão Di Santinni')}
			statusBarTextColor='black'>
			<RegisterHeader onBack={onBack} />

			<View className='flex flex-col gap-5 px-4 pt-6 bg-snow'>
				<Text className='text-lg font-semibold leading-6 tracking-[2%] bg-gradient-to-br from-[#E23D58] to-[#C8102E] bg-clip-text text-transparent'>
					{t('registerPermission.title', 'Uso dos Dados Pessoais')}
				</Text>

				<View className='flex flex-col gap-5'>
					<Text className='text-sm  leading-5 tracking-[2%] text-[#555555]'>
						{t(
							'registerPermission.paragraph1',
							'Os Dados Pessoais fornecidos por você serão utilizados para preenchimento da proposta de adesão ao cartão de crédito emitida pela Credsystem, inclusive para análise cadastral, creditícia.'
						)}
					</Text>

					<Text className='text-sm leading-5 tracking-[2%] text-[#555555]'>
						{t(
							'registerPermission.paragraph2',
							'Compartilhamento para oferta futura de produtos e serviços (serviços financeiros, Seguros, assistência médica e odontológica) e para comunicação ao Banco Central do Brasil (“SCR”).'
						)}
					</Text>

					<Text className='text-sm leading-5 tracking-[2%] text-[#555555]'>
						{t(
							'registerPermission.paragraph3',
							'Caso sua proposta de adesão ao cartão seja negada, seus Dados Pessoais serão armazenados para futura reanálise cadastral e/ou creditícia e demais finalidades previstas no'
						)}{' '}
						<Text className='text-sm font-bold leading-5 tracking-[2%] text-[#555555]'>
							{t('registerPermission.privacyPolicy', 'Contrato e Política de Privacidade')}
						</Text>
						.
					</Text>
				</View>

				<View onClick={onPressLearnMore}>
					<Text className='text-sm leading-5 tracking-[2%] text-[#1A5FA8] underline'>
						{t('registerPermission.learnMore', 'Saiba mais')}
					</Text>
				</View>

				<View className='flex items-center justify-between gap-24 min-h-[71px] px-[10px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'>
					<View
						className='flex items-center gap-[10px] flex-1'
						onClick={() => setAccepted(!accepted)}>
						<CardCheckbox
							checked={accepted}
							onChange={setAccepted}
						/>

						<Text className='text-xs leading-5 tracking-[0.24px] text-[#0C0C0C]'>
							{t('registerPermission.agree', 'Compreendi e concordo em seguir')}
						</Text>
					</View>

					<CustomButton
						label={t('registerPermission.continue', 'Continuar')}
						disabled={!accepted}
						className={`!h-[25px] !w-[108px] px-6 !bg-[#C8102E] ${accepted ? '' : 'opacity-40'}`}
						textClassName='!text-white text-[10px] font-semibold uppercase tracking-[2%]'
						onPress={onPressContinue}
					/>
				</View>

				<BottomInset />
			</View>

			<DocumentNotice
				show={showDocumentNotice}
				onClose={() => setShowDocumentNotice(false)}
				onPressContinue={onContinueDocumentNotice}
			/>

			<SecurityNotice
				show={showSecurityNotice}
				onClose={() => setShowSecurityNotice(false)}
				onPressAgree={onAgreeSecurityNotice}
			/>
		</Page>
	)
}
