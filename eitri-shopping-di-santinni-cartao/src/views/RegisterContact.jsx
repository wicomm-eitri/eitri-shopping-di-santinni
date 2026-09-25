import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton, CustomInput } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import { isValidCpf } from '../services/CardService'
import { navigate, PAGES } from '../services/NavigationService'
import { isValidEmail, isValidPhone, REGISTER_TOTAL_STEPS } from '../utils/utils'

const INPUT_CLASS_NAME =
	'!bg-white text-sm text-neutral-400 leading-5 tracking-[0.28px] py-[14px] px-4 !border !border-neutral-300'

export default function RegisterContact() {
	const { t } = useTranslation()

	const [cpf, setCpf] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')

	// TODO: a validação dos campos (CPF, celular e e-mail) deve seguir as regras da API, aguardando o envio das credenciais.
	const isFormValid = isValidCpf(cpf) && isValidPhone(phone) && isValidEmail(email)

	const onChangeValue = setValue => e => setValue(e?.target ? e.target.value : e)

	const onBack = () => Eitri.navigation.back()

	const onPressContinue = () => navigate(PAGES.PERSONAL_DATA)

	return (
		<Page
			title={t('registerContact.pageTitle', 'Preencha seus Dados')}
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<View className='flex flex-col gap-5 px-4 pt-6 bg-snow'>
				<LoanProgress
					currentStep={1}
					totalSteps={REGISTER_TOTAL_STEPS}
				/>

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('registerContact.pageTitle', 'Preencha seus Dados')}
				</Text>

				<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
					{t('registerContact.description', 'Para começarmos, digite seu CPF, Número de contato e E-mail')}
				</Text>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>{t('registerContact.cpf', 'CPF')}</Text>

					<CustomInput
						placeholder={t('registerContact.cpfPlaceholder', 'Digite seu CPF')}
						value={cpf}
						inputMode='numeric'
						variant='mask'
						mask='999.999.999-99'
						onChange={onChangeValue(setCpf)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>{t('registerContact.phone', 'Celular')}</Text>

					<CustomInput
						placeholder={t('registerContact.phonePlaceholder', 'Digite seu celular')}
						value={phone}
						inputMode='numeric'
						variant='mask'
						mask='(99) 99999-9999'
						onChange={onChangeValue(setPhone)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>{t('registerContact.email', 'E-mail')}</Text>

					<CustomInput
						placeholder={t('registerContact.emailPlaceholder', 'Digite seu e-mail')}
						value={email}
						inputMode='email'
						onChange={onChangeValue(setEmail)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<CustomButton
					label={t('registerContact.continue', 'Continuar')}
					className='!h-[34px]'
					textClassName='text-xs uppercase tracking-[0.24px]'
					disabled={!isFormValid}
					onPress={onPressContinue}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}
