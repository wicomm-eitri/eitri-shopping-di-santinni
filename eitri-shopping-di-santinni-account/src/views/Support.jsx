import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText } from 'eitri-shopping-di-santinni-shared'
import telefoneIcon from '../assets/icons/telefone.svg'

export default function Support() {
	const { t } = useTranslation()

	const openEmail = () => {
		try {
			Eitri.deeplink.open({ url: 'mailto:faleconosco@disantinni.com.br' })
		} catch (error) {
			console.error('error [openEmail]', error)
		}
	}

	const openPhone = () => {
		try {
			Eitri.deeplink.open({ url: 'tel:+5511000000000' })
		} catch (error) {
			console.error('error [openPhone]', error)
		}
	}

	return (
		<Page
			title={t('support.pageTitle', 'Suporte')}
			className=' h-screen'>
			<HeaderContentWrapper className='justify-start gap-1 items-center  px-4'>
				<HeaderReturn />
				<HeaderText text={t('support.pageTitle', 'Suporte')} />
			</HeaderContentWrapper>

			<View className='mt-4 px-4'>
				<View className='bg-white overflow-hidden rounded'>
					{/* Item: Telefone */}
					<View
						className='px-4 py-5 flex flex-row items-center justify-between border-b  active:bg-gray-50 '
						onClick={openPhone}>
						<View className='flex flex-row items-center gap-3'>
							<Image
								src={telefoneIcon}
								className='w-4 h-4'
							/>
							<Text className='text-sm text-gray-700'>(11) 0000 0000</Text>
						</View>

						<svg
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M9 18L15 12L9 6'
								stroke='#262626'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>

					{/* Item: E-mail */}
					<View
						className='px-4 py-5 flex flex-row items-center justify-between border-b border-neutral active:bg-gray-50 '
						onClick={openEmail}>
						<View className='flex flex-row items-center gap-3'>
							<svg
								width='20'
								height='20'
								viewBox='0 0 20 20'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M3.90625 5.62496L9.46637 9.61684C9.78741 9.84733 10.2126 9.84733 10.5336 9.61684L16.0938 5.62496M4.375 15.8333H15.625C16.6605 15.8333 17.5 14.9627 17.5 13.8888V6.11107C17.5 5.03718 16.6605 4.16663 15.625 4.16663H4.375C3.33947 4.16663 2.5 5.03718 2.5 6.11107V13.8888C2.5 14.9627 3.33947 15.8333 4.375 15.8333Z'
									stroke='#E31D5C'
									strokeWidth='1.4'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>

							<Text className='text-sm text-gray-700'>faleconosco@disantinni.com.br</Text>
						</View>

						<svg
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M9 18L15 12L9 6'
								stroke='#262626'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>

					{/* Seção: Horário de funcionamento */}
					<View className='px-4 pt-5 pb-6 flex flex-col gap-2'>
						<Text className='font-semibold text-red-700'>
							{t('support.hours', 'Horário de funcionamento')}
						</Text>

						<View className='flex flex-col gap-1'>
							<Text className='text-sm text-neutral-500 leading-relaxed'>
								{t('support.daysHours', 'Seg. à Sex. das 8h às 17h')}
							</Text>
							<Text className='text-sm text-neutral-500 leading-relaxed'>
								{t('support.exceptions', 'Exceto Feriados')}
							</Text>
						</View>
					</View>
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
