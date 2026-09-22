import Eitri from 'eitri-bifrost'
import { Page, View, Text, Image } from 'eitri-luminus'
import { BottomInset, CustomButton } from 'eitri-shopping-di-santinni-shared'
import CardHeader from '../components/CardHeader/CardHeader'
import FinancialServices from '../components/FinancialServices/FinancialServices'
import { logout, navigate, PAGES } from '../services/NavigationService'
import AnnuityIcon from '../assets/icons/menu-annuity.svg'
import CardLimitIcon from '../assets/icons/menu-card-limit.svg'
import DigitalCardIcon from '../assets/icons/menu-digital-card.svg'
import HelpIcon from '../assets/icons/menu-help.svg'
import InvoiceIcon from '../assets/icons/menu-invoice.svg'
import LoanIcon from '../assets/icons/menu-loan.svg'
import NotificationsIcon from '../assets/icons/menu-notifications.svg'
import PayInvoiceIcon from '../assets/icons/menu-pay-invoice.svg'
import ProfileIcon from '../assets/icons/menu-profile.svg'

const ITEMS_PER_ROW = 3

// TODO: definir destino (link/rota) dos itens sem navegação
const MENU_SECTIONS = [
	{
		title: 'Meu Perfil',
		items: [
			{ label: 'Meus dados', icon: ProfileIcon, iconClassName: 'w-5 h-5', onPress: () => {} },
			{ label: 'Notificações', icon: NotificationsIcon, iconClassName: 'w-[19px] h-[22px]', onPress: () => {} },
			{ label: 'Me ajuda', icon: HelpIcon, onPress: () => navigate(PAGES.HELP) }
		]
	},
	{
		title: 'Cartão DS',
		items: [
			{ label: 'Ver Fatura', icon: InvoiceIcon, onPress: () => navigate(PAGES.MY_INVOICES) },
			{ label: 'Pagar Fatura', icon: PayInvoiceIcon, onPress: () => navigate(PAGES.PAY_INVOICE) },
			{ label: 'Cartão Digital', icon: DigitalCardIcon, iconClassName: 'w-5 h-5', onPress: () => {} },
			{
				label: 'Limite de\nCartão',
				icon: CardLimitIcon,
				iconClassName: 'w-[21px] h-[21px]',
				onPress: () => navigate(PAGES.CARD_LIMIT)
			},
			{
				label: 'Anuidade',
				icon: AnnuityIcon,
				iconClassName: 'w-[21px] h-[22px]',
				onPress: () => navigate(PAGES.ANNUITY)
			},
			{ label: 'Empréstimo\nPessoal', icon: LoanIcon, onPress: () => navigate(PAGES.LOAN) }
		]
	}
]

export default function Menu() {
	const onBack = () => Eitri.navigation.back()

	return (
		<Page
			title='Menu - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader
				onBack={onBack}
				showMenu={false}
			/>

			<View className='flex flex-col gap-5 px-4 pt-6 bg-snow'>
				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					Menu
				</Text>

				<View className='flex flex-col gap-3'>
					{MENU_SECTIONS.map(section => (
						<View
							key={section.title}
							className='flex flex-col gap-3'>
							<Text className='text-xs font-semibold leading-6 tracking-[0.24px] text-black'>
								{section.title}
							</Text>

							{chunkItems(section.items, ITEMS_PER_ROW).map(row => (
								<View
									key={row.map(item => item.label).join('-')}
									className='flex flex-row justify-between w-full'>
									{row.map(item => (
										<MenuItem
											key={item.label}
											item={item}
										/>
									))}
								</View>
							))}
						</View>
					))}
				</View>

				<FinancialServices />

				<CustomButton
					outlined
					className='!h-[34px] !border-red-700'
					onPress={logout}>
					<Text className='text-xs font-bold uppercase tracking-[0.24px] text-red-700'>Sair</Text>
				</CustomButton>

				<BottomInset />
			</View>
		</Page>
	)
}

const chunkItems = (items, size) => {
	const rows = []

	for (let i = 0; i < items.length; i += size) {
		rows.push(items.slice(i, i + size))
	}

	return rows
}

function MenuItem(props) {
	const { item } = props

	return (
		<View
			className='flex flex-col items-center justify-center shrink-0 gap-[5px] w-[95px] h-[95px] rounded-lg bg-[#FAFAF8] drop-shadow-[0px_4px_3px_rgba(0,0,0,0.1)]'
			onClick={item.onPress}>
			<Image
				src={item.icon}
				alt=''
				className={item.iconClassName || 'w-6 h-6'}
			/>

			<Text className='text-xs leading-[18px] tracking-[0.24px] text-center whitespace-pre-line text-[#0C0C0C]'>
				{item.label}
			</Text>
		</View>
	)
}
