import { useTranslation } from 'eitri-i18n'
import { View, Text, Image } from 'eitri-luminus'
import RadioCheckedIcon from '../../assets/icons/radio-checked.svg'

export default function AnnuityOption(props) {
	const { option, selected, onPress } = props

	const { t } = useTranslation()

	const containerClassName = selected
		? 'bg-gradient-to-br from-[#E23D58] to-[#C8102E] shadow-[0_4px_3px_0_rgba(0,0,0,0.25)]'
		: 'bg-[#FAFAF8] shadow-[0_4px_3px_0_rgba(0,0,0,0.1)]'

	const textClassName = selected ? 'text-white' : 'text-[#0C0C0C]'

	return (
		<View
			className={`flex flex-row items-center justify-between h-[60px] px-[10px] rounded-lg ${containerClassName}`}
			onClick={onPress}>
			<View className='flex flex-row items-center gap-[10px]'>
				{selected ? (
					<Image
						src={RadioCheckedIcon}
						alt=''
						className='w-4 h-4'
					/>
				) : (
					<View className='w-4 h-4 rounded-full bg-white border border-[#E23D58]' />
				)}

				<Text className={`text-xs ${selected ? 'font-semibold' : ''} ${textClassName}`}>
					{t(`annuity.options.${option.id}`, option.label)}
				</Text>
			</View>

			<Text className={`text-xs font-semibold ${textClassName}`}>
				{option.price}
				{t('annuity.perMonth', '/mês')}
			</Text>
		</View>
	)
}
