import { useTranslation } from 'eitri-i18n'
import { CustomButton } from 'eitri-shopping-di-santinni-shared'
import LoanField from './components/LoanField'
import LoanStatusBadge from './components/LoanStatusBadge'

export default function LoanCard(props) {
	const { loan, onPressDetails } = props

	const { t } = useTranslation()

	return (
		<View className='flex flex-col gap-[31px] px-6 py-8 rounded-lg bg-[#FAFAF8] shadow-[0_4px_3px_0_rgba(0,0,0,0.1)]'>
			<View className='flex flex-row items-start justify-between'>
				<LoanField
					label={t('loanCard.contractNumber', 'Número do contrato')}
					value={loan.id}
				/>
				<LoanStatusBadge status={loan.status} />
			</View>

			<View className='flex flex-row items-start justify-between'>
				<LoanField
					label={t('loanCard.contractedAmount', 'Valor contratado')}
					value={loan.contractedAmount}
				/>
				<LoanField
					label={t('loanCard.installmentAmount', 'Valor da parcela')}
					value={loan.installmentAmount}
				/>
			</View>

			<LoanField
				label={t('loanCard.contractDate', 'Data da contratação')}
				value={loan.contractDate}
			/>

			<Text className='text-xs underline text-[#1A5FA8]'>{t('loanCard.ccbDetails', 'Detalhes da CCB')}</Text>

			<CustomButton
				outlined
				className='!h-[34px] !border-[#C8102E]'
				onPress={onPressDetails}>
				<Text className='text-xs font-bold uppercase tracking-[0.24px] text-[#C8102E]'>
					{t('loanCard.loanDetails', 'Detalhes do empréstimo')}
				</Text>
			</CustomButton>
		</View>
	)
}
