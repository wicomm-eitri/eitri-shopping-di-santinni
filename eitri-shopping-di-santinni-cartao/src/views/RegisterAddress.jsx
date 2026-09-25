import { useEffect, useRef, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton, CustomInput } from 'eitri-shopping-di-santinni-shared'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import RegisterHeader from '../components/RegisterHeader/RegisterHeader'
import { getAddressByPostalCode } from '../services/CustomerService'
import { getStateName, isValidPostalCode, REGISTER_TOTAL_STEPS } from '../utils/utils'

const INPUT_CLASS_NAME =
	'!bg-white text-sm text-gray-900 leading-5 tracking-[2%] py-[14px] px-4 !border !border-neutral-300'

export default function RegisterAddress() {
	const { t } = useTranslation()

	const [postalCode, setPostalCode] = useState('')
	const [street, setStreet] = useState('')
	const [number, setNumber] = useState('')
	const [complement, setComplement] = useState('')
	const [city, setCity] = useState('')
	const [state, setState] = useState('')
	const [isSearchingPostalCode, setIsSearchingPostalCode] = useState(false)
	const [postalCodeNotFound, setPostalCodeNotFound] = useState(false)

	const lastSearchedPostalCode = useRef('')

	useEffect(() => {
		if (!isValidPostalCode(postalCode)) {
			lastSearchedPostalCode.current = ''
			setIsSearchingPostalCode(false)
			setPostalCodeNotFound(false)

			return
		}

		searchPostalCode(postalCode)
	}, [postalCode])

	const searchPostalCode = async value => {
		lastSearchedPostalCode.current = value
		setIsSearchingPostalCode(true)
		setPostalCodeNotFound(false)

		const address = await getAddressByPostalCode(value)

		if (lastSearchedPostalCode.current !== value) return

		setIsSearchingPostalCode(false)

		if (!address) {
			setPostalCodeNotFound(true)

			return
		}

		if (address.street) setStreet(address.street)

		if (address.city) setCity(address.city)

		if (address.state) setState(getStateName(address.state))
	}

	// TODO: a validação dos campos deve seguir as regras da API, aguardando o envio das credenciais.
	const isFormValid =
		isValidPostalCode(postalCode) &&
		!isSearchingPostalCode &&
		!!street.trim() &&
		!!number.trim() &&
		!!city.trim() &&
		!!state.trim()

	const onChangeValue = setValue => e => setValue(e?.target ? e.target.value : e)

	const onBack = () => Eitri.navigation.back()

	// TODO: definir destino (rota) do botão, a próxima etapa do cadastro ainda não existe
	const onPressContinue = () => {}

	return (
		<Page
			title={t('registerAddress.pageTitle', 'Endereço Residencial')}
			statusBarTextColor='black'>
			<RegisterHeader onBack={onBack} />

			<View className='flex flex-col gap-5 px-4 pt-6 bg-snow'>
				<LoanProgress
					currentStep={5}
					totalSteps={REGISTER_TOTAL_STEPS}
				/>

				<Text className='text-lg font-semibold leading-6 tracking-[2%] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('registerAddress.pageTitle', 'Endereço Residencial')}
				</Text>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>{t('registerAddress.postalCode', 'CEP')}</Text>

					<CustomInput
						placeholder={t('registerAddress.postalCodePlaceholder', 'Digite seu CEP')}
						value={postalCode}
						inputMode='numeric'
						variant='mask'
						mask='99999-999'
						onChange={onChangeValue(setPostalCode)}
						className={INPUT_CLASS_NAME}
					/>

					{postalCodeNotFound && (
						<Text className='text-xs leading-4 text-red-600'>
							{t(
								'registerAddress.errors.postalCodeNotFound',
								'CEP não encontrado. Preencha o endereço manualmente.'
							)}
						</Text>
					)}
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>{t('registerAddress.street', 'Endereço')}</Text>

					<CustomInput
						placeholder={t('registerAddress.streetPlaceholder', 'Digite seu endereço')}
						value={street}
						onChange={onChangeValue(setStreet)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>{t('registerAddress.number', 'Número')}</Text>

					<CustomInput
						placeholder={t('registerAddress.numberPlaceholder', 'Digite o número do edifício')}
						value={number}
						inputMode='numeric'
						onChange={onChangeValue(setNumber)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>
						{t('registerAddress.complement', 'Complemento (Opcional)')}
					</Text>

					<CustomInput
						placeholder={t('registerAddress.complementPlaceholder', 'Apartamento, Referência, etc')}
						value={complement}
						onChange={onChangeValue(setComplement)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>{t('registerAddress.city', 'Cidade')}</Text>

					<CustomInput
						placeholder={t('registerAddress.cityPlaceholder', 'Digite sua cidade')}
						value={city}
						onChange={onChangeValue(setCity)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs leading-5 text-gray-700'>{t('registerAddress.state', 'Estado')}</Text>

					<CustomInput
						placeholder={t('registerAddress.statePlaceholder', 'Digite seu estado')}
						value={state}
						onChange={onChangeValue(setState)}
						className={INPUT_CLASS_NAME}
					/>
				</View>

				<CustomButton
					label={t('registerAddress.continue', 'Continuar')}
					className='!h-[34px]'
					textClassName='text-xs uppercase tracking-[2%]'
					disabled={!isFormValid}
					onPress={onPressContinue}
				/>

				<BottomInset />
			</View>
		</Page>
	)
}
