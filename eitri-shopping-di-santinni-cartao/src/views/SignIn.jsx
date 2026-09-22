import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text } from 'eitri-luminus'
import { BottomInset, CustomButton, CustomInput, Loading } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import Alert from '../components/Alert/Alert'
import CardToggle from '../components/CardToggle/CardToggle'
import {
	clearRememberedCpf,
	isValidCpf,
	loadRememberedCpf,
	loginCard,
	saveRememberedCpf
} from '../services/CardService'
import { navigate, PAGES } from '../services/NavigationService'

export default function SignIn() {
	const [cpf, setCpf] = useState('')
	const [password, setPassword] = useState('')
	const [rememberCpf, setRememberCpf] = useState(true)
	const [loading, setLoading] = useState(false)
	const [showErrorAlert, setShowErrorAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')

	const canSubmit = isValidCpf(cpf) && !!password

	useEffect(() => {
		loadRememberedCpf().then(savedCpf => {
			if (savedCpf) {
				setCpf(savedCpf)
			}
		})
	}, [])

	const onBack = () => Eitri.navigation.back()

	const handleLogin = async () => {
		if (!canSubmit || loading) return

		setLoading(true)

		try {
			await loginCard(cpf, password)

			if (rememberCpf) {
				await saveRememberedCpf(cpf)
			} else {
				await clearRememberedCpf()
			}

			navigate(PAGES.INVOICES, {}, true)
		} catch (e) {
			console.error('handleLogin error:', e)
			setAlertMessage('CPF ou senha inválidos')
			setShowErrorAlert(true)
		} finally {
			setLoading(false)
		}
	}

	// TODO: definir destino (link/rota) dos botões
	const onPressForgotPassword = () => {}

	const onPressFirstAccess = () => {}

	return (
		<Page
			title='Entrar - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader
				onBack={onBack}
				showMenu={false}
			/>

			<Loading
				isLoading={loading}
				fullScreen={true}
			/>

			<View className='flex flex-col justify-between gap-10 min-h-[75vh] px-4 pt-6 bg-snow'>
				<View className='flex flex-col gap-[30px]'>
					<View className='flex flex-col gap-3'>
						<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
							Seja bem-vindo!
						</Text>

						<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
							Para acessar sua conta, digite seu CPF e sua senha nos campos abaixo:
						</Text>
					</View>

					<View className='flex flex-col gap-[25px]'>
						<CustomInput
							placeholder='CPF'
							value={cpf}
							inputMode='numeric'
							variant='mask'
							mask='999.999.999-99'
							onChange={e => setCpf(e.target ? e.target.value : e)}
							className='bg-white text-sm text-primary tracking-[0.28px] h-[42px] px-4 !border !border-gray-200'
						/>

						<CustomInput
							placeholder='Senha'
							type='password'
							value={password}
							onChange={e => setPassword(e.target.value)}
							className='bg-white text-sm text-primary tracking-[0.28px] h-[42px] px-4 pr-10 !border !border-gray-200'
						/>

						<View className='flex items-center gap-2'>
							<CardToggle
								checked={rememberCpf}
								onChange={setRememberCpf}
							/>

							<Text
								className='text-sm leading-5 tracking-[0.28px] text-gray-700'
								onClick={() => setRememberCpf(!rememberCpf)}>
								Lembrar CPF
							</Text>
						</View>

						<View onClick={onPressForgotPassword}>
							<Text className='text-sm leading-5 tracking-[0.28px] text-gray-900 underline'>
								Esqueceu a senha?
							</Text>
						</View>
					</View>
				</View>

				<View className='flex flex-col gap-[10px] w-full'>
					<CustomButton
						label='Entrar'
						disabled={!canSubmit}
						className='!h-[34px] text-xs uppercase tracking-[0.24px]'
						onPress={handleLogin}
					/>

					<CustomButton
						outlined
						className='!h-[34px] !border-red-700'
						onPress={onPressFirstAccess}>
						<Text className='text-xs font-bold uppercase tracking-[0.24px] text-red-700'>
							Primeiro acesso
						</Text>
					</CustomButton>
				</View>
			</View>

			<BottomInset />

			<Alert
				show={showErrorAlert}
				onDismiss={() => setShowErrorAlert(false)}
				duration={5}
				message={alertMessage}
			/>
		</Page>
	)
}
