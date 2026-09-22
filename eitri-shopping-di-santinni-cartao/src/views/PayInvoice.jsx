import Eitri from 'eitri-bifrost'
import { BottomInset } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import PaymentMethodOption from '../components/PaymentMethodOption/PaymentMethodOption'
import PixIcon from '../assets/icons/pix.svg'
import ShopIcon from '../assets/icons/shop.svg'
import TicketIcon from '../assets/icons/ticket.svg'

const PAYMENT_METHODS = [
	{
		id: 'pix',
		icon: PixIcon,
		title: 'PIX (melhor opção)',
		subtitle: 'A vista ou parcelado'
	},
	{
		id: 'shop',
		icon: ShopIcon,
		title: 'Loja',
		subtitle: 'A vista ou parcelado'
	},
	{
		id: 'ticket',
		icon: TicketIcon,
		title: 'Boleto',
		subtitle: 'A vista ou parcelado'
	}
]

export default function PayInvoice() {
	const onBack = () => Eitri.navigation.back()

	// TODO: definir destino (link/rota) de cada meio de pagamento
	const onPressPaymentMethod = () => {}

	return (
		<Page
			title='Pagar Fatura'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<View className='flex flex-col gap-[30px] px-4 pt-5 bg-snow'>
				<Text className='text-lg font-semibold leading-6 bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Pagar Fatura
				</Text>

				<View className='relative w-full h-2 overflow-hidden rounded-[5px] bg-[#F2F2F0]'>
					<View className='absolute top-0 left-0 h-2 rounded-[5px] bg-[#434343] w-[20%]' />
				</View>

				<Text className='text-sm font-semibold leading-5 text-[#0C0C0C]'>Escolha como quer pagar</Text>

				<View className='flex flex-col gap-[30px]'>
					{PAYMENT_METHODS.map(method => (
						<PaymentMethodOption
							key={method.id}
							icon={method.icon}
							title={method.title}
							subtitle={method.subtitle}
							onPress={onPressPaymentMethod}
						/>
					))}
				</View>

				<BottomInset />
			</View>
		</Page>
	)
}
