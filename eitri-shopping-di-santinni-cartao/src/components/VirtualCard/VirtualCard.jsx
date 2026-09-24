import { useTranslation } from 'eitri-i18n'
import logo from '../../assets/images/logoHeader.png'

const BARCODE_RUNS = [
	3, 3, 1, 2, 1, 5, 4, 3, 4, 2, 4, 3, 2, 1, 5, 3, 4, 2, 1, 1, 3, 2, 3, 6, 1, 2, 3, 1, 3, 6, 1, 2, 6, 1, 2, 1, 3, 3, 2,
	6, 1, 4, 2, 1, 5, 1, 2, 6, 1, 2, 4, 3, 3, 1, 3, 2, 1, 2, 4, 6, 2, 1, 3, 4, 3, 2, 1, 3, 4
]

export default function VirtualCard(props) {
	const { name, number, expiry, cvv } = props

	const { t } = useTranslation()

	const fields = [
		{ id: 'name', label: t('virtualCard.name', 'Nome'), value: name },
		{ id: 'number', label: t('virtualCard.number', 'Número'), value: number },
		{ id: 'expiry', label: t('virtualCard.expiry', 'Validade'), value: expiry },
		{ id: 'cvv', label: t('virtualCard.cvv', 'CVV'), value: cvv }
	]

	return (
		<View className='relative w-full h-[216px] px-6 pt-[23px] rounded-xl bg-gradient-to-b from-[#1C50A2] to-[#001D4A]'>
			<Image
				src={logo}
				alt=''
				className='w-[103px] h-4 object-contain brightness-0 invert'
			/>

			<View className='flex flex-col gap-[15px] mt-[17px]'>
				{fields.map(field => (
					<View
						key={field.id}
						className='flex flex-col gap-[6px]'>
						<Text className='text-[7px] leading-[10px] text-white/90'>{field.label}</Text>
						<Text className='text-[8px] font-bold leading-[10px] text-white'>{field.value}</Text>
					</View>
				))}
			</View>

			<Text className='absolute left-[144px] bottom-[9px] text-[7px] leading-[15px] whitespace-pre-line text-white/90'>
				{t('virtualCard.disclaimer', '*Cartão válido para uma única\ncompra ou até as 23:59 de hoje')}
			</Text>

			<Text className='absolute right-[56px] bottom-[14px] text-[7px] leading-[8px] text-white/80 [writing-mode:vertical-rl] rotate-180'>
				{t('virtualCard.barcode', 'Código de Barras')}
			</Text>

			<View className='absolute right-6 top-[14px] flex flex-col w-7 h-[188px] bg-white'>
				{BARCODE_RUNS.map((run, index) => (
					<View
						key={index}
						className={index % 2 === 0 ? 'bg-white' : 'bg-black'}
						style={{ height: `${run}px` }}
					/>
				))}
			</View>
		</View>
	)
}
