import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton, Loading } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import CardToggle from '../components/CardToggle/CardToggle'
import { getCardLimit } from '../services/CardService'
import { goHome } from '../services/NavigationService'
import InfoIcon from '../assets/icons/info.svg'
import CardBanner from '../assets/images/card-banner.svg'
import { formatPrice } from '../utils/utils'

const getAvailableLimit = (totalLimit, usedLimit) => {
	const total = Math.max(Number(totalLimit) || 0, 0)
	const used = Math.max(Number(usedLimit) || 0, 0)

	return Math.max(total - used, 0)
}

const getUsedPercent = (totalLimit, usedLimit) => {
	const total = Math.max(Number(totalLimit) || 0, 0)
	const used = Math.max(Number(usedLimit) || 0, 0)

	if (!total) return 0

	return Math.min((used / total) * 100, 100)
}

export default function CardLimit() {
	const [limit, setLimit] = useState(null)
	const [autoLimitIncrease, setAutoLimitIncrease] = useState(false)

	useEffect(() => {
		loadLimit()
	}, [])

	const loadLimit = async () => {
		try {
			const data = await getCardLimit()

			setLimit(data)
			setAutoLimitIncrease(data.autoLimitIncrease)
		} catch (e) {
			console.error('loadLimit error:', e)
		}
	}

	const onBack = () => Eitri.navigation.back()

	// TODO: integrar com a API para salvar a preferência de aumento automático
	const onChangeAutoLimitIncrease = value => setAutoLimitIncrease(value)

	// TODO: definir comportamento do ícone de informação
	const onPressInfo = () => {}

	const availableLimit = limit ? getAvailableLimit(limit.totalLimit, limit.usedLimit) : 0
	const usedPercent = limit ? getUsedPercent(limit.totalLimit, limit.usedLimit) : 0

	return (
		<Page
			title='Limite - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={!limit}
				fullScreen={true}
			/>

			{limit && (
				<View className='flex flex-col gap-8 px-4 pt-5 bg-snow'>
					<View className='flex flex-col items-center gap-2 py-5 rounded-lg shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] bg-[linear-gradient(103deg,var(--tw-gradient-stops))] from-red-500 to-red-700'>
						<Text className='text-xs tracking-[0.24px] font-medium text-white'>Você ainda pode gastar</Text>

						<Text className='text-[32px] font-semibold tracking-[0.64px] text-white'>
							{formatPrice(availableLimit)}
						</Text>
					</View>

					<View className='flex flex-col gap-3'>
						<View className='flex items-center justify-between'>
							<Text className='text-xs font-semibold tracking-[0.24px] text-[#8C8C8C]'>
								Limite Utilizado
							</Text>

							<Text className='text-xs font-semibold tracking-[0.24px] text-[#8C8C8C]'>
								Limite Total
							</Text>
						</View>

						<View className='w-full h-2.5 rounded-full overflow-hidden bg-gray-100'>
							<View
								className='h-full rounded-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-500'
								style={{ width: `${usedPercent}%` }}
							/>
						</View>

						<View className='flex items-center justify-between'>
							<Text className='text-xs font-semibold tracking-[0.24px] text-primary'>
								{formatPrice(limit.usedLimit)}
							</Text>

							<Text className='text-xs font-semibold tracking-[0.24px] text-primary'>
								{formatPrice(limit.totalLimit)}
							</Text>
						</View>
					</View>

					<View className='flex flex-col gap-3'>
						<Text className='text-lg font-semibold tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
							Dobre seu limite
						</Text>

						<Text className='text-xs leading-6 tracking-[0.24px] text-black'>
							Compre em 12x fixas com a 1a em até 70 dias e dobre o seu limite para{' '}
							{formatPrice(limit.doubledLimit)}
						</Text>

						<Image
							src={CardBanner}
							alt='Cartão Di Santinni'
							className='w-full h-auto mt-1 rounded-lg'
						/>
					</View>

					<View className='flex flex-col gap-7'>
						<View className='w-full h-px bg-gray-300' />

						<View className='flex items-center justify-between'>
							<View className='flex items-center gap-2'>
								<Text className='text-sm font-semibold tracking-[0.28px] text-primary'>
									Aumento de limite automático
								</Text>

								<View onClick={onPressInfo}>
									<Image
										src={InfoIcon}
										alt='Informações sobre o aumento de limite automático'
										className='w-6 h-6'
									/>
								</View>
							</View>

							<CardToggle
								checked={autoLimitIncrease}
								onChange={onChangeAutoLimitIncrease}
							/>
						</View>

						<CustomButton
							label='Ir para loja'
							className='!h-[34px]'
							textClassName='text-xs uppercase tracking-[0.24px]'
							onPress={goHome}
						/>
					</View>

					<BottomInset />
				</View>
			)}
		</Page>
	)
}
