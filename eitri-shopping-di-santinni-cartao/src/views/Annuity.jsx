import { useTranslation } from 'eitri-i18n'
import { Page, View, Text } from 'eitri-luminus'
import { BottomInset, CustomButton } from 'eitri-shopping-di-santinni-shared'
import Eitri from 'eitri-bifrost'
import CardHeader from '../components/CardHeader/CardHeader'
import AnnuityOption from '../components/AnnuityOption/AnnuityOption'

const BONUS_OPTION = {
	id: 'bonus',
	label: '+ Bônus',
	price: 'R$ 11,99'
}

const DIFFERENTIATED_OPTION = {
	id: 'differentiated',
	label: 'Diferenciada',
	price: 'R$ 6,99'
}

export default function Annuity() {
	const { t } = useTranslation()

	const [selectedOption, setSelectedOption] = useState(BONUS_OPTION.id)

	const onBack = () => Eitri.navigation.back()

	return (
		<Page
			title='Anuidade - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<View className='flex flex-col gap-[30px] px-4 pt-5 bg-snow'>
				<Text className='text-lg font-semibold tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('annuity.pageTitle', 'Anuidade')}
				</Text>

				<Text className='text-lg font-semibold text-[#0C0C0C]'>
					{t('annuity.heading', 'Escolha a opção que mais combina com você')}
				</Text>

				<AnnuityOption
					option={BONUS_OPTION}
					selected={selectedOption === BONUS_OPTION.id}
					onPress={() => setSelectedOption(BONUS_OPTION.id)}
				/>

				<View className='flex flex-col gap-2'>
					<Text className='text-xs font-semibold text-[#0C0C0C]'>
						{t('annuity.rewardsTitle', 'Transforme anuidade em recompensas!')}
					</Text>
					<Text className='text-xs text-[#0C0C0C]'>
						{t(
							'annuity.rewardsDescription',
							'A cada fatura paga, o valor do +Bônus vira crédito para aproveitar benefícios, recompensas e experiências do seu jeito.'
						)}
					</Text>
				</View>

				<Text className='text-xs font-semibold underline text-[#1A5FA8]'>
					{t('annuity.learnMore', 'Saiba mais')}
				</Text>

				<AnnuityOption
					option={DIFFERENTIATED_OPTION}
					selected={selectedOption === DIFFERENTIATED_OPTION.id}
					onPress={() => setSelectedOption(DIFFERENTIATED_OPTION.id)}
				/>

				<CustomButton
					label={t('annuity.confirm', 'Confirmar')}
					backgroundColor='bg-[#C8102E]'
					className='!h-[34px]'
					textClassName='text-xs uppercase tracking-[0.24px]'
				/>

				<BottomInset />
			</View>
		</Page>
	)
}
