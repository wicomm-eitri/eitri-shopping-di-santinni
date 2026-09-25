import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton, CustomInput } from 'eitri-shopping-di-santinni-shared'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import RegisterHeader from '../components/RegisterHeader/RegisterHeader'
import { REGISTER_TOTAL_STEPS } from '../utils/utils'

const INPUT_CLASS_NAME =
	'!bg-white text-sm text-neutral-400 leading-5 tracking-[0.28px] py-[14px] px-4 !border !border-neutral-300'

export default function RegisterPersonalDetails() {
	const { t } = useTranslation()

	const [fullName, setFullName] = useState('')
	const [rg, setRg] = useState('')
	const [motherName, setMotherName] = useState('')

	// TODO: a validação dos campos (RG, nome e nome da mãe) deve seguir as regras da API, aguardando o envio das credenciais.
	const isFormValid = fullName.trim() && rg.trim() && motherName.trim()

	const onChangeValue = setValue => e => setValue(e?.target ? e.target.value : e)

	const onBack = () => Eitri.navigation.back()

	// TODO: definir destino (link/rota) do botão
	const onPressContinue = () => {}

	return (
		<Page
			title={t('registerPersonalDetails.pageTitle', 'Preencha seus Dados')}
			statusBarTextColor='black'>
			<RegisterHeader onBack={onBack} />

			<View className='flex flex-col gap-5 px-4 pt-6 bg-snow'>
				<LoanProgress
					currentStep={6}
					totalSteps={REGISTER_TOTAL_STEPS}
				/>

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('registerPersonalDetails.pageTitle', 'Preencha seus Dados')}
				</Text>

				<Text className='text-sm leading-5 tracking-[0.28px] text-gray-700'>
					{t(
						'registerPersonalDetails.description',
						'Para continuarmos, digite seu Nome, Número de RG e Nome da sua mãe'
					)}
				</Text>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>
						{t('registerPersonalDetails.fullName', 'Nome completo')}
					</Text>

					<CustomInput
						placeholder={t('registerPersonalDetails.fullNamePlaceholder', 'Digite seu nome completo')}
						value={fullName}
						inputMode='text'
						onChange={onChangeValue(setFullName)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>{t('registerPersonalDetails.rg', 'RG')}</Text>

					<CustomInput
						placeholder={t('registerPersonalDetails.rgPlaceholder', 'Digite o número do seu RG')}
						value={rg}
						inputMode='numeric'
						onChange={onChangeValue(setRg)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>
						{t('registerPersonalDetails.motherName', 'Nome da sua mãe')}
					</Text>

					<CustomInput
						placeholder={t(
							'registerPersonalDetails.motherNamePlaceholder',
							'Digite o nome completo de sua mãe'
						)}
						value={motherName}
						inputMode='text'
						onChange={onChangeValue(setMotherName)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<CustomButton
					label={t('registerPersonalDetails.continue', 'Continuar')}
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
