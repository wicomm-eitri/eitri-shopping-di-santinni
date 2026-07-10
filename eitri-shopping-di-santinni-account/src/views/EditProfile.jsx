import React, { useState, useEffect } from 'react'
import { useTranslation } from 'eitri-i18n'
import {
	CustomButton,
	CustomInput,
	HeaderText,
	HeaderContentWrapper,
	Loading,
	HeaderReturn,
	BottomInset
} from 'eitri-shopping-di-santinni-shared'
import { getCustomerData, setCustomerData } from '../services/CustomerService'
import { sendScreenView } from '../services/TrackingService'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'
import formatDateMMDDYYYY, { formatDate } from '../utils/utils'

export default function EditProfile(props) {
	const [user, setUser] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState({})
	const [showNotification, setShowNotification] = useState(false)

	const { t } = useTranslation()

	useEffect(() => {
		const customerData = props?.location?.state?.customerData

		if (!customerData) {
			loadMe()
		} else {
			setUser({
				...user,
				...customerData,
				birthDate: formatDateMMDDYYYY(customerData?.birthDate)
			})
		}

		sendScreenView('Editar Perfil', 'EditProfile')
		addonUserTappedActiveTabListener()
	}, [])

	const handleInputChange = (target, value) => {
		setUser({
			...user,
			[target]: value
		})

		if (errors[target]) {
			setErrors({
				...errors,
				[target]: null
			})
		}
	}

	const validateFields = () => {
		const newErrors = {}

		if (!user.firstName || user.firstName.trim() === '') {
			newErrors.firstName = t('editProfile.errors.firstNameRequired', 'Nome é obrigatório')
		}

		if (!user.document || user.document.trim() === '') {
			newErrors.document = t('editProfile.errors.documentRequired', 'CPF é obrigatório')
		}

		if (!user.homePhone || user.homePhone.trim() === '') {
			newErrors.homePhone = t('editProfile.errors.phoneRequired', 'Celular é obrigatório')
		}

		if (!user.email || user.email.trim() === '') {
			newErrors.email = t('editProfile.errors.emailRequired', 'E-mail é obrigatório')
		}

		if (!user.gender) {
			newErrors.gender = t('editProfile.errors.genderRequired', 'Gênero é obrigatório')
		}

		if (!user.birthDate || user.birthDate.trim() === '') {
			newErrors.birthDate = t('editProfile.errors.birthDateRequired', 'Data de nascimento é obrigatória')
		} else {
			const { isValid } = convertToISO(user.birthDate)

			if (!isValid) {
				newErrors.birthDate = t(
					'editProfile.errors.birthDateInvalid',
					'Data de nascimento inválida ou menor de 18 anos'
				)
			}
		}

		setErrors(newErrors)

		return Object.keys(newErrors).length === 0
	}

	const handleSave = async () => {
		try {
			if (!validateFields()) {
				return
			}

			setIsLoading(true)
			const { isValid, isoDate } = convertToISO(user.birthDate)

			if (!isValid) {
				setIsLoading(false)

				return
			}

			const updatedUser = await setCustomerData({ ...user, birthDate: isoDate })

			setUser({ ...updatedUser, birthDate: formatDate(updatedUser?.birthDate) })
			setIsLoading(false)
			setShowNotification(true)
			setTimeout(() => {
				setShowNotification(false)
			}, 3000)
		} catch (e) {
			setIsLoading(false)
		}
	}

	const loadMe = async () => {
		setIsLoading(true)
		const customerData = await getCustomerData()

		setUser({ ...customerData, birthDate: customerData?.birthDate ? formatDate(customerData?.birthDate) : '' })
		setIsLoading(false)
	}

	function convertToISO(dateStr) {
		if (!dateStr) return { isValid: false }

		const dt = dateStr?.replaceAll('/', '')

		if (dt.length < 8) return { isValid: false }

		const day = parseInt(dt.substring(0, 2), 10)
		const month = parseInt(dt.substring(2, 4), 10)
		const year = parseInt(dt.substring(4, 8), 10)

		const date = new Date(year, month - 1, day)

		let isValid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day

		if (!isValid) {
			return { isValid }
		}

		const today = new Date()

		isValid =
			today.getFullYear() - year > 18 ||
			(today.getFullYear() - year === 18 && today.getMonth() > month) ||
			(today.getFullYear() - year === 18 && today.getMonth() === month && today.getDate() >= day)

		if (!isValid) {
			return { isValid }
		}

		return { isValid, isoDate: date.toISOString() }
	}

	const isFormValid = () => {
		return (
			user.firstName &&
			user.firstName.trim() !== '' &&
			user.birthDate &&
			user.birthDate.trim() !== '' &&
			user.homePhone &&
			user.homePhone.trim() !== '' &&
			user.email &&
			user.email.trim() !== '' &&
			user.gender &&
			user.document &&
			user.document.trim() !== ''
		)
	}

	return (
		<Page
			title={'Minha conta'}
			statusBarTextColor='white'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('editProfile.headerTitle', 'Minha conta')} />
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			<View className='p-4 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-250px)]'>
				<Text className='font-bold text-base text-[#C8102E]'>
					{t('editProfile.subtitle', 'Editar informações')}
				</Text>

				{/* 1. Nome completo */}
				<View className='flex flex-col gap-1'>
					<Text className='font-medium text-sm text-neutral-800'>
						{t('editProfile.lbName', 'Nome completo')}
					</Text>
					<CustomInput
						className='!border-0 !border-b !border-gray-400 !rounded-none !px-0 !bg-transparent !focus:border-neutral-800'
						backgroundColor='transparent'
						placeholder='Giovanna'
						value={user?.firstName || ''}
						onChange={e => handleInputChange('firstName', e.target ? e.target.value : e)}
						error={errors.firstName}
					/>
					{errors.firstName && <Text className='text-red-500 text-xs mt-0.5'>{errors.firstName}</Text>}
				</View>

				{/* 2. CPF */}
				<View className='flex flex-col gap-1'>
					<Text className='font-medium text-sm text-neutral-800'>{t('editProfile.lbCPF', 'CPF')}</Text>
					<CustomInput
						className='!border-0 !border-b !border-gray-400 !rounded-none !px-0 !bg-transparent !focus:border-neutral-800'
						backgroundColor='transparent'
						placeholder='123.456.789-10'
						value={user?.document || ''}
						inputMode='numeric'
						variant='mask'
						mask='999.999.999-99'
						onChange={e => handleInputChange('document', e.target ? e.target.value : e)}
						error={errors.document}
					/>
					{errors.document && <Text className='text-red-500 text-xs mt-0.5'>{errors.document}</Text>}
				</View>

				{/* 3. Celular */}
				<View className='flex flex-col gap-1'>
					<Text className='font-medium text-sm text-neutral-800'>{t('editProfile.lbPhone', 'Celular')}</Text>
					<CustomInput
						className='!border-0 !border-b !border-gray-400 !rounded-none !px-0 !bg-transparent !focus:border-neutral-800'
						backgroundColor='transparent'
						placeholder='(00) 00000-0000'
						value={user?.homePhone?.replace('+55', '') || ''}
						inputMode='numeric'
						variant='mask'
						mask='(99) 99999-9999'
						onChange={e => handleInputChange('homePhone', e.target ? e.target.value : e)}
						error={errors.homePhone}
					/>
					{errors.homePhone && <Text className='text-red-500 text-xs mt-0.5'>{errors.homePhone}</Text>}
				</View>

				{/* 4. E-mail */}
				<View className='flex flex-col gap-1'>
					<Text className='font-medium text-sm text-neutral-800'>{t('editProfile.lbEmail', 'E-mail')}</Text>
					<CustomInput
						className='!border-0 !border-b !border-gray-400 !rounded-none !px-0 !bg-transparent !focus:border-neutral-800'
						backgroundColor='transparent'
						placeholder='giovanafiorillo@mail.com.br'
						inputMode='email'
						value={user?.email || ''}
						onChange={e => handleInputChange('email', e.target ? e.target.value : e)}
						error={errors.email}
					/>
					{errors.email && <Text className='text-red-500 text-xs mt-0.5'>{errors.email}</Text>}
				</View>

				{/* 5. Gênero (Ajustado para usar input com linha inferior também) */}
				<View className='flex flex-col gap-4'>
					<Text className='font-medium text-sm text-neutral-800'>{t('editProfile.lbGender', 'Gênero')}</Text>
					{/* Linha simulando o input para manter consistência visual caso prefira usar texto/select ou manter as opções de rádio em uma linha inferior */}
					<View className='flex flex-row gap-6 py-2 border-b border-gray-400'>
						<View
							className='flex flex-row items-center gap-2'
							sendFocusToInput>
							<Radio
								value='female'
								checked={user?.gender === 'female'}
								onChange={() => handleInputChange('gender', 'female')}
							/>
							<Text className='text-sm text-neutral-700'>
								{t('editProfile.lbGenderFemale', 'Feminino')}
							</Text>
						</View>
						<View
							className='flex flex-row items-center gap-2'
							sendFocusToInput>
							<Radio
								value='male'
								checked={user?.gender === 'male'}
								onChange={() => handleInputChange('gender', 'male')}
							/>
							<Text className='text-sm text-neutral-700'>
								{t('editProfile.lbGenderMale', 'Masculino')}
							</Text>
						</View>
					</View>
					{errors.gender && <Text className='text-red-500 text-xs mt-0.5'>{errors.gender}</Text>}
				</View>

				{/* 6. Data de nascimento */}
				<View className='flex flex-col gap-1'>
					<Text className='font-medium text-sm text-neutral-800'>
						{t('editProfile.lbBirthdate', 'Data de nascimento')}
					</Text>
					<CustomInput
						className='!border-0 !border-b !border-gray-400 !rounded-none !px-0 !bg-transparent !focus:border-neutral-800'
						backgroundColor='transparent'
						placeholder='00/00/0000'
						variant='mask'
						mask='99/99/9999'
						inputMode='numeric'
						value={user?.birthDate || ''}
						onChange={e => handleInputChange('birthDate', e.target ? e.target.value : e)}
						error={errors.birthDate}
					/>
					{errors.birthDate && <Text className='text-red-500 text-xs mt-0.5'>{errors.birthDate}</Text>}
				</View>

				{showNotification && (
					<View className='bg-green-500 text-white px-4 py-3 rounded shadow-lg flex flex-row items-center justify-between mt-2'>
						<View className='flex flex-row items-center gap-2'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='text-white'>
								<path d='M20 6L9 17l-5-5'></path>
							</svg>
							<Text className='text-white font-medium'>
								{t('editProfile.saveSuccess', 'Salvo com sucesso!')}
							</Text>
						</View>
					</View>
				)}
			</View>

			<View className='fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200'>
				<View className='p-4'>
					<CustomButton
						width='100%'
						label={t('editProfile.lbSave', 'SALVAR')}
						onPress={handleSave}
						disabled={!isFormValid() || isLoading}
					/>
				</View>
				<BottomInset />
			</View>

			<BottomInset offSet={85} />
		</Page>
	)
}
