import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'eitri-i18n'
import { CustomButton, HeaderContentWrapper, HeaderReturn, HeaderText } from 'eitri-shopping-di-santinni-shared'
import { navigate, PAGES } from '../services/NavigationService'
import { sendScreenView } from '../services/TrackingService'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'

export default function PasswordResetCode(props) {
	const [recoveryCode, setRecoveryCode] = useState('')
	const digitCount = 6
	const digitRefs = useRef([])

	const handleDigitChange = (index, val) => {
		const digit = (val || '').replace(/\D/g, '').slice(0, 1)
		const chars = recoveryCode.split('').slice(0, digitCount)

		while (chars.length < digitCount) chars.push('')

		chars[index] = digit

		const newCode = chars.join('')

		setRecoveryCode(newCode)

		if (digit && index < digitCount - 1) {
			digitRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace') {
			if (!e.target.value && index > 0) {
				digitRefs.current[index - 1]?.focus()
			}
		}
	}

	const email = props?.location?.state?.email

	const { t } = useTranslation()

	useEffect(() => {
		addonUserTappedActiveTabListener()
		sendScreenView('Reset de senha - código', 'PasswordResetCode')
	}, [])

	const goToPasswordNewPass = () => {
		if (recoveryCode.length !== digitCount) {
			return
		}

		navigate(PAGES.PASSWORD_RESET_NEW_PASS, { email: email, recoveryCode })
	}

	return (
		<Page topInset>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('passwordResetCode.headerText', 'Senha')} />
			</HeaderContentWrapper>

			<View className='p-4 flex flex-col w-full'>
				<View className='flex flex-col gap-2'>
					<Text className='text text-gray-700'>
						{t('passwordResetCode.messageEmail', 'Digite o código de 6 dígitos enviado para o email')}
						<Text className='font-bold text-red-700  ml-1'>{email}</Text>
					</Text>
				</View>

				<View className='mt-4 flex gap-3 justify-center w-full'>
					{Array.from({ length: digitCount }).map((_, i) => (
						<TextInput
							key={i}
							ref={el => (digitRefs.current[i] = el)}
							className='w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-center text-lg border border-gray-300 !p-0 text-gray-900'
							value={recoveryCode[i] || ''}
							onChange={e => handleDigitChange(i, e.target.value)}
							onKeyDown={e => handleKeyDown(i, e)}
							inputMode='numeric'
							maxLength={1}
						/>
					))}
				</View>

				<View className='mt-8'>
					<CustomButton
						disabled={recoveryCode.length !== digitCount}
						className='uppercase !h-11 rounded-full'
						textClassName='font-semibold'
						label={t('passwordResetCode.sendButton', 'CONTINUAR')}
						onPress={goToPasswordNewPass}
					/>
				</View>
			</View>
		</Page>
	)
}
