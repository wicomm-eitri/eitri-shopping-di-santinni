import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton, CustomInput } from 'eitri-shopping-di-santinni-shared'
import BoxRadioOption from '../components/BoxRadioOption/BoxRadioOption'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import RegisterHeader from '../components/RegisterHeader/RegisterHeader'
import SelectField from '../components/SelectField/SelectField'
import { navigate, PAGES } from '../services/NavigationService'
import { isValidBirthDate, REGISTER_TOTAL_STEPS } from '../utils/utils'

const OCCUPATIONS = [
	{ value: 'self-employed', key: 'selfEmployed', label: 'Autônomo' },
	{ value: 'employee', key: 'employee', label: 'Assalariado' },
	{ value: 'unemployed', key: 'unemployed', label: 'Sem trabalho' },
	{ value: 'retired', key: 'retired', label: 'Aposentado ou Pensionista' },
	{ value: 'professional', key: 'professional', label: 'Profissional liberal' },
	{ value: 'entrepreneur', key: 'entrepreneur', label: 'Empresário' }
]

const GENDERS = [
	{ value: 'male', label: 'Masculino' },
	{ value: 'female', label: 'Feminino' }
]

export default function PersonalData() {
	const { t } = useTranslation()

	const [birthDate, setBirthDate] = useState('')
	const [occupation, setOccupation] = useState('')
	const [gender, setGender] = useState('')

	const isBirthDateComplete = birthDate.length === 10
	const hasBirthDateError = isBirthDateComplete && !isValidBirthDate(birthDate)

	const onBack = () => Eitri.navigation.back()

	const onPressContinue = () => navigate(PAGES.REGISTER_BIOMETRICS)

	return (
		<Page
			title={t('personalData.pageTitle', 'Preencha seus Dados')}
			statusBarTextColor='black'>
			<RegisterHeader onBack={onBack} />

			<View className='flex flex-col gap-[25px] px-4 pt-6 bg-snow'>
				<LoanProgress
					currentStep={2}
					totalSteps={REGISTER_TOTAL_STEPS}
				/>

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('personalData.pageTitle', 'Preencha seus Dados')}
				</Text>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>
						{t('personalData.birthDate', 'Data de Nascimento')}
					</Text>

					<CustomInput
						placeholder={t('personalData.birthDatePlaceholder', 'DD/MM/AAAA')}
						value={birthDate}
						inputMode='numeric'
						variant='mask'
						mask='99/99/9999'
						onChange={e => setBirthDate(e.target ? e.target.value : e)}
						className={`!bg-white text-sm text-neutral-400 leading-5 tracking-[0.28px] py-[14px] px-4 !border ${hasBirthDateError ? '!border-red-600' : '!border-neutral-300'}`}
					/>

					{hasBirthDateError && (
						<Text className='text-xs leading-4 text-red-600'>
							{t(
								'personalData.errors.birthDateInvalid',
								'Data de nascimento inválida ou menor de 18 anos'
							)}
						</Text>
					)}
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>{t('personalData.occupation', 'Ocupação')}</Text>

					<Text className='text-[10px] leading-5 text-gray-700'>
						{t('personalData.occupationHint', 'Informe sua ocupação e faremos a análise das informações.')}
					</Text>

					<SelectField
						options={OCCUPATIONS.map(option => ({
							value: option.value,
							label: t(`personalData.occupations.${option.key}`, option.label)
						}))}
						value={occupation}
						placeholder={t('personalData.occupationPlaceholder', 'Selecionar Opção')}
						onChange={setOccupation}
					/>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-4 text-gray-700'>{t('personalData.gender', 'Sexo')}</Text>

					<View className='flex flex-row gap-3 w-full'>
						{GENDERS.map(option => (
							<BoxRadioOption
								key={option.value}
								label={t(`personalData.genders.${option.value}`, option.label)}
								selected={gender === option.value}
								onPress={() => setGender(option.value)}
							/>
						))}
					</View>
				</View>

				<CustomButton
					label={t('personalData.continue', 'Continuar')}
					className='!h-[34px]'
					textClassName='text-xs uppercase tracking-[0.24px]'
					disabled={!isValidBirthDate(birthDate) || !occupation || !gender}
					onPress={onPressContinue}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}
