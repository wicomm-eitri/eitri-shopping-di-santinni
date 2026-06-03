import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import {
	CustomButton,
	CustomInput,
	HeaderText,
	HeaderContentWrapper,
	HeaderReturn,
	Loading
} from 'eitri-shopping-di-santinni-shared'
import Alert from '../components/Alert/Alert'
import CCheckbox from '../components/CCheckbox/CCheckbox'
import SocialLogin from '../components/SocialLogin/SocialLogin'
import {
	getSavedUser,
	sendAccessKeyByEmail,
	saveUserCredentialsOnStorage
} from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { getStorePreferences, getLoginProviders } from '../services/StoreService'
import { sendScreenView } from '../services/TrackingService'
import lockIcon from '../assets/icons/lock.svg'
import userIcon from '../assets/icons/user.svg'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'

export default function SignUp(props) {
	const [storeConfig, setStoreConfig] = useState(false)
	const [termsChecked, setTermsChecked] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')
	const [verificationCode, setVerificationCode] = useState('')
	const [emailCodeSent, setEmailCodeSent] = useState(false)
	const [timeOutToResentEmail, setTimeOutToResentEmail] = useState(0)
	const [loadingSendingCode, setLoadingSendingCode] = useState(false)
	const [loginProviders, setLoginProviders] = useState({ oAuthProviders: [{ providerName: 'Google' }] })
	const [loadingLoginProviders, setLoadingLoginProviders] = useState(false)
	const [canUseSocialLogin, setCanUseSocialLogin] = useState(false)

	const TIME_TO_RESEND_EMAIL = 60
	const resendCode = timeOutToResentEmail > 0

	const { t } = useTranslation()

	useEffect(() => {
		getStorePreferences().then(conf => {
			setStoreConfig(conf)
		})

		const loadLoginProviders = async () => {
			try {
				setLoadingLoginProviders(true)
				const providers = await getLoginProviders()
				const { applicationData } = await Eitri.getConfigs()

				if (applicationData?.platform === 'android') {
					setCanUseSocialLogin(true)
				}

				if (providers && providers?.oAuthProviders?.length > 0) {
					setLoginProviders(providers)
				} else if (providers) {
					setLoginProviders(prev => {
						const merged = { ...prev, ...providers }

						if (!providers?.oAuthProviders || providers.oAuthProviders.length === 0) {
							merged.oAuthProviders = prev.oAuthProviders
						}

						return merged
					})
				}
			} catch (e) {
				console.error('Erro ao carregar provedores de login', e)
			} finally {
				setLoadingLoginProviders(false)
			}
		}

		loadLoginProviders()

		const loadSavedUser = async () => {
			const user = await getSavedUser()

			if (user && user.email) {
				setEmail(user.email)
			}
		}

		loadSavedUser()
		addonUserTappedActiveTabListener()
		sendScreenView('Cadastro', 'SignUp')
	}, [])

	useEffect(() => {
		if (timeOutToResentEmail > 0) {
			setTimeout(() => {
				setTimeOutToResentEmail(prevState => prevState - 1)
			}, 1000)
		}
	}, [timeOutToResentEmail])

	const sendAccessKey = async () => {
		if (!termsChecked) {
			setAlertMessage(t('signUp.alertMessageAcceptTerms', 'Necessário aceitar os termos'))
			setShowLoginErrorAlert(true)

			return
		}

		try {
			if (timeOutToResentEmail > 0) return

			setLoadingSendingCode(true)
			await sendAccessKeyByEmail(email)
			setEmailCodeSent(true)
			setTimeOutToResentEmail(TIME_TO_RESEND_EMAIL)
		} catch (e) {
			setAlertMessage(t('signUp.alertMessageSendEmailError', 'Erro ao enviar email'))
			setShowLoginErrorAlert(true)
			setEmailCodeSent(false)
			setTimeOutToResentEmail(0)
		} finally {
			setLoadingSendingCode(false)
		}
	}

	const loginWithEmailAndAccessKey = async () => {
		setLoading(true)

		try {
			await setPassword(email, verificationCode, password)
			navigate(PAGES.HOME)
		} catch (e) {
			const status = e?.response?.status || 400

			if (status >= 500) {
				setAlertMessage(t('signUp.alertMessageServiceError', 'Ocorreu uma falha no serviço, tente novamente'))
			} else {
				setAlertMessage(t('signUp.alertMessageVerify', 'Verifique as informaçoes e tente novamente'))
			}

			setShowLoginErrorAlert(true)
		} finally {
			setLoading(false)
		}
	}

	const handleSocialLogin = async () => {
		try {
			navigate(PAGES.HOME)
		} catch (error) {
			console.log('Error [handleSocialLogin]', error)
		}
	}

	return (
		<Page topInset>
			<Loading
				isLoading={loading}
				fullScreen={true}
			/>

			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('signUp.lbRegister', 'Registrar')} />
			</HeaderContentWrapper>

			<View className='p-4'>
				<Text className='text-xl font-bold'>{t('signUp.lbEmailAccess', 'Acessar com o seu email')}</Text>

				<View className='mt-8 flex flex-col gap-3'>
					<CustomInput
						icon={userIcon}
						value={email}
						type='email'
						placeholder={t('signUp.emailPlaceholder', 'Email')}
						onChange={e => setEmail(e.target.value)}
						showClearInput={false}
						required={true}
						className='bg-white text-xs h-[42px]'
					/>
					<CustomInput
						icon={lockIcon}
						value={password}
						type='password'
						placeholder={t('signUp.placeholderPass', 'Senha')}
						onChange={e => setPassword(e.target.value)}
						required={true}
						className='bg-white text-xs h-[42px]'
					/>

					<CustomInput
						icon={lockIcon}
						value={confirmPassword}
						type='password'
						placeholder={t('signUp.placeholderConfirmPass', 'Confirmar Senha')}
						onChange={e => setConfirmPassword(e.target.value)}
						required={true}
						className='bg-white text-xs h-[42px]'
					/>
					<CCheckbox
						label={`${t('signUp.textTerms', 'Ao clicar em Registrar você concorda com os termos de serviço')}${storeConfig?.displayCompanyName ? ' ' + storeConfig?.displayCompanyName : ''}.`}
						checked={termsChecked}
						onChange={setTermsChecked}
					/>

					{emailCodeSent && (
						<>
							<CustomInput
								label={t('signUp.lbVerifyCode', 'Código de verificação')}
								placeholder={t('signUp.lbVerifyCode', 'Código de verificação')}
								inputMode='numeric'
								value={verificationCode}
								onChange={e => setVerificationCode(e.target.value)}
								height='45px'
							/>

							<CustomButton
								className='uppercase !h-11 rounded-full'
								textClassName='font-semibold'
								label={t('signUp.lbLogin', 'ENTRAR')}
								onPress={loginWithEmailAndAccessKey}
								disabled={!email || !verificationCode}
								type='email'
							/>
						</>
					)}

					{!emailCodeSent ? (
						<CustomButton
							width='100%'
							className='uppercase !h-11 rounded-full'
							textClassName='font-semibold'
							label={t('signUp.lbRegister', 'CRIAR CONTA')}
							disabled={!email || !password || !confirmPassword || loadingSendingCode}
							onPress={async () => {
								if (!termsChecked) {
									setAlertMessage(t('signUp.alertMessageAcceptTerms', 'Necessário aceitar os termos'))
									setShowLoginErrorAlert(true)

									return
								}

								if (password !== confirmPassword) {
									setAlertMessage(
										t('signUp.alertMessagePasswordsNotMatch', 'As senhas não coincidem')
									)
									setShowLoginErrorAlert(true)

									return
								}

								try {
									setLoadingSendingCode(true)
									await sendAccessKeyByEmail(email)
									await saveUserCredentialsOnStorage(email, password)
									setEmailCodeSent(true)
									setTimeOutToResentEmail(TIME_TO_RESEND_EMAIL)
								} catch (e) {
									setAlertMessage(t('signUp.alertMessageSendEmailError', 'Erro ao enviar email'))
									setShowLoginErrorAlert(true)
									setEmailCodeSent(false)
									setTimeOutToResentEmail(0)
								} finally {
									setLoadingSendingCode(false)
								}
							}}
						/>
					) : (
						<CustomButton
							width='100%'
							className='uppercase !h-11 rounded-full'
							variant='outlined'
							label={t('signUp.lbBack', 'VOLTAR')}
							onPress={() => Eitri.navigation.back()}
						/>
					)}
				</View>

				{canUseSocialLogin && (
					<View className='mt-8 mb-8 flex w-full items-center gap-x-4'>
						<View className='h-px flex-1 bg-gray-300' />
						<Text className='flex-shrink-0 text-accent-100 font-medium uppercase'>Ou</Text>
						<View className='h-px flex-1 bg-gray-300' />
					</View>
				)}

				<SocialLogin
					oAuthProviders={loginProviders?.oAuthProviders || [{ providerName: 'Google' }]}
					handleSocialLogin={handleSocialLogin}
					canUseGoogleLogin={canUseSocialLogin}
				/>
			</View>
			<Alert
				type='negative'
				show={showLoginErrorAlert}
				onDismiss={() => setShowLoginErrorAlert(false)}
				duration={7}
				message={alertMessage}
			/>
		</Page>
	)
}
