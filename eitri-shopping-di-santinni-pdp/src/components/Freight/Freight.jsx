import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { CustomButton, CustomInput } from 'eitri-shopping-di-santinni-shared'
import { loadPostalCodeFromStorage, savePostalCodeOnStorage } from '../../services/customerService'
import fetchFreight from '../../services/freightService'

export default function Freight(props) {
	const { currentSku } = props
	const { t } = useTranslation()
	const [zipCode, setZipCode] = useState('')
	const [errorZipCode, setErrorZipCode] = useState('')
	const [freightOptions, setFreightOptions] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		loadPostalCodeFromStorage()
			.then(postalCode => {
				if (postalCode) {
					setZipCode(postalCode)
					handleFreight(postalCode)
				}
			})
			.catch()
	}, [])

	const onInputZipCode = e => {
		const value = e.target.value

		setErrorZipCode('')
		setZipCode(value)
	}

	const handleFreight = async (zipCode, buttonIsClicked = false) => {
		if (loading) return

		if (buttonIsClicked && String(zipCode || '').replace(/\D/g, '').length !== 8) {
			setErrorZipCode(t('freight.errorInvalidZipCode', 'CEP inválido. Verifique e tente novamente.'))
			setFreightOptions(null)

			return
		}

		setLoading(true)

		try {
			let freightOpt = await fetchFreight(zipCode, currentSku)

			if (buttonIsClicked && !(freightOpt?.options?.length > 0)) {
				setErrorZipCode(t('freight.errorInvalidZipCode', 'CEP inválido. Verifique e tente novamente.'))
				setFreightOptions(null)
				setLoading(false)

				return
			}

			setFreightOptions(freightOpt)
			await savePostalCodeOnStorage(zipCode)
		} catch (error) {
			console.error('Error handleFreight', error)
		}

		setLoading(false)
	}

	const handleClickDontKnowZipCode = async () => {
		await Eitri.openBrowser({
			url: 'https://buscacepinter.correios.com.br/app/endereco/index.php',
			inApp: true
		})
	}

	return (
		<View className='flex flex-col py-4 w-full'>
			<View className='flex items-center justify-between mb-4 w-full'>
				<Text className='font-bold'>{t('freight.txtCalculate', 'Consulte o frete')}</Text>
			</View>
			<View>
				<View className='flex justify-between items-center w-full gap-2'>
					<View className='w-2/3'>
						<CustomInput
							placeholder={t('freight.labelZipCode', 'CEP')}
							value={zipCode}
							variant='mask'
							mask='99999-999'
							inputMode='numeric'
							className='border-[#D4D4D4]'
							onChange={onInputZipCode}
						/>
					</View>
					<View className='w-1/3'>
						<CustomButton
							label={t('freight.labelCalculate', 'Calcular')}
							classNameLabel='uppercase'
							className='rounded-full bg-primary'
							onClick={() => handleFreight(zipCode, true)}
						/>
					</View>
				</View>
				{errorZipCode && (
					<View className='mt-2'>
						<Text className='text-xs text-red-900'>{errorZipCode}</Text>
					</View>
				)}

				{loading && <View className={`mt-3 w-full h-[100px] bg-gray-200 rounded animate-pulse`} />}

				{!loading && freightOptions && freightOptions?.options?.length > 0 && (
					<View className='flex flex-col items-center justify-between gap-2 mt-3'>
						{freightOptions?.options?.map(item => (
							<View
								key={item?.label}
								className='flex flex-col items-center w-full'>
								<View className='flex items-center justify-between w-full'>
									<Text className='font-bold'>{item?.name}</Text>
									<Text>{item?.formatedPrice}</Text>
								</View>
								<View className='flex items-center justify-between w-full'>
									<Text className='text-neutral-content'>{item?.formattedShippingEstimate}</Text>
								</View>
								{item?.pickupStoreInfo?.isPickupStore && (
									<View className='flex items-center w-full'>
										<Text className='text-neutral-content'>{item.pickupStoreInfo?.address}</Text>
									</View>
								)}
							</View>
						))}
					</View>
				)}
			</View>
			<View
				className='mt-2'
				onClick={handleClickDontKnowZipCode}>
				<Text className='text-xs text-red-900 underline'>
					{t('freight.txtDontKnowZipCode', 'Não sei meu CEP')}
				</Text>
			</View>
		</View>
	)
}
