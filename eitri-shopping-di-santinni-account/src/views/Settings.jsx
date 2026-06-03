import React, { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText } from 'eitri-shopping-di-santinni-shared'
import { isLoggedIn } from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { sendScreenView } from '../services/TrackingService'

export default function Settings() {
	const [isLogged, setIsLogged] = useState(null)
	const [notificationsEnabled, setNotificationsEnabled] = useState(false)

	const { t } = useTranslation()

	useEffect(() => {
		const init = async () => {
			try {
				const isLogged = await isLoggedIn()

				setIsLogged(isLogged)

				const permission = await Eitri.notification.checkPermission()

				if (permission?.status === 'GRANTED' || permission?.status === 'LIMITED') {
					setNotificationsEnabled(true)
				} else {
					setNotificationsEnabled(false)
				}
			} catch (error) {
				console.error('Erro no init:', error)
			}
		}

		init()
		sendScreenView('Configurações', 'Settings')
	}, [])

	const handleNotificationEnabled = async () => {
		try {
			const permission = await Eitri.notification.checkPermission()

			// Já permitido
			if (permission?.status === 'GRANTED' || permission?.status === 'LIMITED') {
				if (notificationsEnabled) {
					await handlePermissionConfig()
				} else {
					setNotificationsEnabled(true)
				}

				return
			}

			if (permission?.status === 'DENIED') {
				const request = await Eitri.notification.requestPermission()

				if (request?.status === 'GRANTED' || request?.status === 'LIMITED') {
					setNotificationsEnabled(true)
				} else {
					setNotificationsEnabled(false)
					await handlePermissionConfig()
				}

				return
			}

			if (permission?.status === 'BLOCKED') {
				setNotificationsEnabled(false)
				await handlePermissionConfig()

				return
			}
		} catch (error) {
			console.error('Erro ao verificar notificação:', error)
		}
	}

	const handlePermissionConfig = async () => {
		try {
			await Eitri.system.openAppSettings()
		} catch (error) {
			console.error('Erro ao abrir configurações:', error)
		}
	}

	return (
		<Page
			title={t('settings.title', 'Configurações')}
			className='bg-white h-screen'>
			<HeaderContentWrapper className='justify-start gap-1 items-center'>
				<HeaderReturn />
				<HeaderText text={t('settings.title', 'Configurações')} />
			</HeaderContentWrapper>

			<View className='p-4'>
				{isLogged && (
					<View
						className='my-6 p-4 border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50'
						onClick={() => navigate(PAGES.EDIT_PROFILE)}>
						<Text className='text-neutral-700'>{t('settings.personalInfo', 'Informações pessoais')}</Text>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<polyline points='9 18 15 12 9 6'></polyline>
						</svg>
					</View>
				)}

				{/* Seção Configurações do aplicativo */}
				<Text className='text-lg font-medium text-neutral-800 mb-3'>
					{t('settings.appSettings', 'Configurações do aplicativo')}
				</Text>

				<View className='p-4 flex items-center justify-between border-b border-neutral-300 mt-2 mb-8'>
					<Text className='text-neutral-700'>{t('settings.notifications', 'Notificações')}</Text>

					<View
						onClick={handleNotificationEnabled}
						className={`w-9 h-5 rounded-full p-[2px] flex items-center cursor-pointer transition-colors ${notificationsEnabled ? 'bg-[#C8102E]' : 'bg-gray-300'}`}>
						<View
							className={`w-[14px] h-[14px] bg-white rounded-full transition-transform duration-200`}
							style={{ transform: notificationsEnabled ? 'translateX(18px)' : 'translateX(0px)' }}
						/>
					</View>
				</View>

				{/* Seção Sobre nós */}
				<Text className='text-lg font-medium text-neutral-800'>{t('settings.aboutUs', 'Sobre nós')}</Text>

				<View className='mt-2'>
					{/* Item: Sobre nós */}
					<View
						className='p-4 flex items-center justify-between border-b border-neutral-300 cursor-pointer hover:bg-gray-50'
						onClick={() => navigate(PAGES.SUPPORT)}>
						<Text className='text-base text-neutral-700'>{t('settings.aboutUs', 'Sobre nós')}</Text>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<polyline points='9 18 15 12 9 6'></polyline>
						</svg>
					</View>

					{/* Item: Política de privacidade */}
					<View
						className='p-4 flex items-center justify-between border-b border-neutral-300 cursor-pointer hover:bg-gray-50'
						onClick={() => navigate(PAGES.SUPPORT)}>
						<Text className='text-base text-neutral-700'>
							{t('settings.privacyPolicy', 'Políticas de Privacidade')}
						</Text>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<polyline points='9 18 15 12 9 6'></polyline>
						</svg>
					</View>

					{/* Item: Trocas e devoluções */}
					<View
						className='p-4 flex items-center justify-between border-b border-neutral-300 cursor-pointer hover:bg-gray-50'
						onClick={() => navigate(PAGES.SUPPORT)}>
						<Text className='text-base text-neutral-700'>
							{t('settings.exchangesReturns', 'Trocas e devoluções')}
						</Text>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<polyline points='9 18 15 12 9 6'></polyline>
						</svg>
					</View>

					{/* Item: Nossas Lojas */}
					<View
						className='p-4 flex items-center justify-between border-b border-neutral-300 cursor-pointer hover:bg-gray-50'
						onClick={() => navigate(PAGES.SUPPORT)}>
						<Text className='text-base text-neutral-700'>{t('settings.ourStores', 'Nossas Lojas')}</Text>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<polyline points='9 18 15 12 9 6'></polyline>
						</svg>
					</View>
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
