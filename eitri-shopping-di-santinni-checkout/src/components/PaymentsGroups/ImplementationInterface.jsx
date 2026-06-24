import { App } from 'eitri-shopping-vtex-shared'
import GooglePay from '@/components/PaymentsGroups/Groups/GooglePay'
import BankInvoice from './Groups/BankInvoice'
import CreditCard from './Groups/CreditCard'
import GiftCard from './Groups/GiftCard'
import InstantPayment from './Groups/InstantPayment'
import StoreCard from './Groups/StoreCard'

export default function ImplementationInterface(props) {
	const { groupName, systemGroup, onSelectPaymentMethod } = props

	const PAYMENT_GROUPS_IMPLEMENTATION = {
		'creditCardPaymentGroup': CreditCard,
		'bankInvoicePaymentGroup': BankInvoice,
		'instantPaymentPaymentGroup': InstantPayment,
		'giftCardPaymentGroup': GiftCard,
		'WH Google PayPaymentGroup': GooglePay,
		'customPrivate_402PaymentGroup': StoreCard
	}

	const externalPaymentsImplementation = App.configs.appConfigs?.externalPayments ?? []

	const externalPaymentRc = externalPaymentsImplementation.find(
		externalPayment => externalPayment.externalGroupName === groupName
	)

	if (externalPaymentRc) {
		return (
			<ExternalPayment
				systemGroup={systemGroup}
				groupName={groupName}
				externalPaymentRc={externalPaymentRc}
				onSelectPaymentMethod={onSelectPaymentMethod}
			/>
		)
	}

	if (!groupName || !PAYMENT_GROUPS_IMPLEMENTATION[groupName]) {
		if (
			groupName?.toLowerCase().includes('custom') || 
			groupName?.toLowerCase().includes('promissory') || 
			groupName?.toLowerCase().includes('storecard') || 
			groupName?.toLowerCase().includes('cobranded')
		) {
			const Implementation = StoreCard
			/*prettier-ignore*/
			return React.createElement(Implementation, { groupName, systemGroup, onSelectPaymentMethod, selectedPayment: props.selectedPayment })
		}

		// Para ajudar a descobrir o ID correto se for diferente:
		return <Text className='text-red-500'>Não mapeado: {groupName}</Text>
		// return null
	}

	const Implementation = PAYMENT_GROUPS_IMPLEMENTATION[groupName]

	/*prettier-ignore*/
	return React.createElement(Implementation, { groupName, systemGroup, onSelectPaymentMethod, selectedPayment: props.selectedPayment })
}
