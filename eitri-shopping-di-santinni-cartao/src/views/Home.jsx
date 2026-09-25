import { useEffect, useRef, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Carousel, Image, Page, Text, View } from 'eitri-luminus'
import { BottomInset, CustomButton } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import SecurityNotice from '../components/SecurityNotice/SecurityNotice'
import { goHome, navigate, PAGES } from '../services/NavigationService'
import CheckIcon from '../assets/icons/check.svg'

const CARD_IMAGE =
	'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/2463d653-3097-4671-ad37-bb5df4c844b5___af21fc87cdaa1a97f88a2279dbd71b74.png'

const CARD_SLIDES = [CARD_IMAGE, CARD_IMAGE, CARD_IMAGE, CARD_IMAGE, CARD_IMAGE]

const GEOLOCATION_PERMISSION_INPUT = { precision: 'precise' }

const RESUME_AFTER_REQUEST_GRACE_MS = 1500

const OPEN_APP_SETTINGS_API_LEVEL = 9

const PERMISSION_GRANTED = 'GRANTED'

const PERMISSION_BLOCKED = 'BLOCKED'

const permissionStatus = permission => String(permission?.status ?? '').toUpperCase()

const isPermissionGranted = permission => permissionStatus(permission) === PERMISSION_GRANTED

const CARD_BENEFITS = [
	'Descontos em produtos o ano todo',
	'Até 12x fixas e 1ª parcela em até 70 dias',
	'Cartão 100% digital. Tudo na palma da mão'
]

export default function Home() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [showSecurityNotice, setShowSecurityNotice] = useState(false)

	const isMountedRef = useRef(true)
	const isRequestingPermissionRef = useRef(false)
	const lastPermissionRequestAtRef = useRef(0)

	const checkGeolocationPermission = async () => {
		const isResumeFromPermissionDialog =
			Date.now() - lastPermissionRequestAtRef.current < RESUME_AFTER_REQUEST_GRACE_MS

		if (isRequestingPermissionRef.current || isResumeFromPermissionDialog) return

		try {
			const permission = await Eitri.geolocation.checkPermission(GEOLOCATION_PERMISSION_INPUT)

			if (isMountedRef.current && !isPermissionGranted(permission)) {
				setShowSecurityNotice(true)
			}
		} catch (error) {
			console.warn('Não foi possível verificar a permissão de geolocalização', error)
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

	const requestGeolocationPermission = async () => {
		if (isRequestingPermissionRef.current) return

		isRequestingPermissionRef.current = true

		let status = ''

		try {
			status = permissionStatus(await Eitri.geolocation.requestPermission(GEOLOCATION_PERMISSION_INPUT))
		} catch (error) {
			console.warn('Não foi possível solicitar a permissão de geolocalização', error)
		} finally {
			isRequestingPermissionRef.current = false
			lastPermissionRequestAtRef.current = Date.now()
		}

		if (status === PERMISSION_BLOCKED) {
			await openAppSettings()
		}
	}

	useEffect(() => {
		isMountedRef.current = true

		checkGeolocationPermission()

		// Verifica novamente sempre que o usuário volta ao app (ex.: retornando das configurações do celular)
		Eitri.navigation.addOnResumeListener(() => checkGeolocationPermission())

		return () => {
			isMountedRef.current = false
		}
	}, [])

	const onDismissSecurityNotice = () => {
		setShowSecurityNotice(false)
		requestGeolocationPermission()
	}

	const onChangeSlide = index => setCurrentSlide(index)

	const onPressHaveCard = () => navigate(PAGES.SIGNIN)

	const onPressBecomeClient = () => navigate(PAGES.REGISTER_CONTACT)

	return (
		<Page
			title='Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader
				onBack={goHome}
				showMenu={false}
			/>

			<View className='flex flex-col items-center gap-10 px-4 pt-6 bg-snow'>
				<View className='flex flex-col items-center gap-10 w-full'>
					<View className='w-full'>
						<Carousel
							config={{
								autoPlay: true,
								interval: 6000,
								loop: true,
								currentSlide,
								onChange: onChangeSlide
							}}>
							{CARD_SLIDES.map((image, index) => (
								<Carousel.Item
									key={`card-slide-${index}`}
									className='w-full'>
									<View className='flex justify-center w-full'>
										<Image
											src={image}
											alt='Cartão Di Santinni'
											className='w-full h-auto'
										/>
									</View>
								</Carousel.Item>
							))}
						</Carousel>
					</View>

					<View className='flex items-center gap-[10px]'>
						{CARD_SLIDES.map((_, index) => (
							<View
								key={`card-dot-${index}`}
								className={`${currentSlide === index ? 'bg-red-700' : 'bg-white'} w-2 h-2 rounded-full border border-red-700 transition-colors duration-300`}
							/>
						))}
					</View>
				</View>

				<View className='flex flex-col gap-2 w-full'>
					<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
						Cartão Di Santinni Vai com Você
					</Text>

					<View className='flex flex-col gap-1'>
						{CARD_BENEFITS.map(benefit => (
							<View
								key={benefit}
								className='flex items-center gap-2'>
								<Image
									src={CheckIcon}
									alt=''
									className='w-[10px] h-[9px]'
								/>

								<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>{benefit}</Text>
							</View>
						))}
					</View>
				</View>

				<View className='flex flex-col gap-[10px] w-full'>
					<CustomButton
						label='Já tenho um cartão'
						className='!h-[34px] text-xs uppercase tracking-[0.24px]'
						onPress={onPressHaveCard}
					/>

					<CustomButton
						outlined
						className='!h-[34px] !border-red-700'
						onPress={onPressBecomeClient}>
						<Text className='text-xs font-bold uppercase tracking-[0.24px] text-red-700'>
							Quero ser um cliente
						</Text>
					</CustomButton>
				</View>

				<BottomInset />
			</View>

			<SecurityNotice
				show={showSecurityNotice}
				onClose={onDismissSecurityNotice}
				onPressAgree={onDismissSecurityNotice}
			/>
		</Page>
	)
}
