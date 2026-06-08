import { useTranslation } from 'eitri-i18n'
import Boleto from '../../Icons/MethodIcons/Boleto'
import GroupsWrapper from './GroupsWrapper'

export default function BankInvoice(props) {
	const { groupName, systemGroup, onSelectPaymentMethod, selectedPayment } = props
	const { t } = useTranslation()

	const paymentSystems = systemGroup?.paymentSystems || []

	const isChecked = (() => {
		if (selectedPayment) {
			const candidates = paymentSystems.map(ps => ps.id)

			return Array.isArray(selectedPayment)
				? selectedPayment.some(p => candidates.includes(p.paymentSystem))
				: candidates.includes(selectedPayment.paymentSystem)
		}

		return systemGroup?.isCurrentPaymentSystemGroup
	})()

	const onSelectThisGroup = async () => {
		if (paymentSystems.length > 0) {
			await onSelectPaymentMethod([
				{
					paymentSystem: paymentSystems[0].id,
					installmentsInterestRate: paymentSystems[0].installments?.[0]?.interestRate || 0,
					installments: paymentSystems[0].installments?.[0]?.count || 1,
					referenceValue: paymentSystems[0].installments?.[0]?.value || cart?.value,
					value: paymentSystems[0].installments?.[0]?.total || cart?.value,
					hasDefaultBillingAddress: true
				}
			])
		}
	}


	return (
		<GroupsWrapper
			title={t('paymentMethods.bankInvoice.title', 'Boleto Bancário')}
			icon={<Boleto />}
			selected={isChecked}
			onPress={onSelectThisGroup}
		/>
	)
}
