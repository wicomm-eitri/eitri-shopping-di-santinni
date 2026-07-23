import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton, HeaderContentWrapper, HeaderText, Loading } from 'eitri-shopping-di-santinni-shared'
import PoweredBy from '../components/PoweredBy/PoweredBy'
import ProfileCardButton from '../components/ProfileCardButton/ProfileCardButton'
import { startConfigure } from '../services/AppService'
import { getCustomerData, isLoggedIn } from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { sendScreenView } from '../services/TrackingService'
import suporteIcon from '../assets/icons/Suporte.svg'
import config from '../assets/icons/config.svg'
import redesSociaisIcon from '../assets/icons/instagram.svg'
import meusFavoritosIcon from '../assets/icons/meus_favoritos.svg'
import meusPedidosIcon from '../assets/icons/meus_pedidos.svg'
import minhaContaIcon from '../assets/icons/minha_conta.svg'
import nossasLojasIcon from '../assets/icons/nossas_lojas.svg'
import trocasDevolucoesIcon from '../assets/icons/trocas_devoluções.svg'

export default function Home(props) {
	const PAGE = 'Minha Conta'

	const { t } = useTranslation()

	const [isLoading, setIsLoading] = useState(true)
	const [customerData, setCustomerData] = useState(props.customerData || {})
	const [isLogged, setIsLogged] = useState(null)

	const handlePlaceholderItem = () => {}

	const allCards = [
		{
			label: t('home.labelMyAccount', 'Minha conta'),
			icon: minhaContaIcon,
			isVisible: true,
			onClick: () => {
				isLogged
					? navigate(PAGES.EDIT_PROFILE, { customerData })
					: navigate(PAGES.SIGNIN, { redirectTo: PAGES.EDIT_PROFILE })
			}
		},
		{
			label: t('home.labelMyOrders', 'Meus pedidos'),
			icon: meusPedidosIcon,
			isVisible: isLogged,
			onClick: () => {
				isLogged ? navigate(PAGES.ORDER_LIST) : navigate(PAGES.SIGNIN, { redirectTo: PAGES.ORDER_LIST })
			}
		},
		{
			label: t('home.labelMyFavorites', 'Meus favoritos'),
			icon: meusFavoritosIcon,
			isVisible: isLogged,
			onClick: () => {
				isLogged ? navigate(PAGES.WISH_LIST) : navigate(PAGES.SIGNIN, { redirectTo: PAGES.WISH_LIST })
			}
		},
		{
			label: t('home.labelExchangesReturns', 'Trocas e devoluções'),
			icon: trocasDevolucoesIcon,
			isVisible: true,
			onClick: () => navigate(PAGES.EXCHANGE_POLICY)
		},
		{
			label: t('home.labelSupport', 'Suporte'),
			icon: suporteIcon,
			isVisible: true,
			onClick: () => navigate(PAGES.SUPPORT)
		},
		{
			label: t('home.labelStores', 'Nossas lojas'),
			icon: nossasLojasIcon,
			isVisible: true,
			onClick: () => navigate(PAGES.NOSSASLOJAS)
		},
		{
			label: t('home.labelSocialNetworks', 'Redes Sociais'),
			icon: redesSociaisIcon,
			isVisible: true,
			onClick: () => Eitri.openBrowser({ url: 'https://www.instagram.com/disantinni/?hl=pt-br', inApp: false })
		}
	]

	useEffect(() => {
		init()
		sendScreenView('Perfil', 'Home')

		Eitri.navigation.setOnResumeListener(() => init())
	}, [])

	const init = async () => {
		await startConfigure()

		const startParams = await Eitri.getInitializationInfos()

		if (startParams?.action === 'RequestLogin') {
			navigate(PAGES.SIGNIN, { closeAppAfterLogin: true }, true)

			return
		}

		if (startParams) {
			const openRoute = processDeepLink(startParams)

			if (openRoute) {
				Eitri.navigation.navigate(openRoute)

				return
			}
		}

		const isLogged = await isLoggedIn()

		if (isLogged) await loadMe()

		setIsLogged(isLogged)
		setIsLoading(false)
	}

	const loadMe = async () => {
		const customerData = await getCustomerData()

		setCustomerData(customerData)
	}

	const processDeepLink = startParams => {
		if (startParams?.route) {
			let { route, ...rest } = startParams

			return {
				path: route,
				state: rest,
				replace: true
			}
		}
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper className='justify-between'>
				<HeaderText text={t('home.labelMyAccount', 'Minha conta')} />
				<Image
					src={config}
					width={24}
					height={24}
					className='object-contain '
					onClick={() => navigate(PAGES.SETTINGS)}
				/>
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>
			{/* 
			{!isLoading && (isLogged ? <InfoCard customerData={customerData} /> : <LoginCard />)} */}

			<View className='px-4 mt-2 mb-2'>
				<View className='flex flex-col gap-3 mt-2'>
					{allCards
						.filter(card => card.isVisible)
						.map(item => (
							<ProfileCardButton
								key={item.label}
								label={item.label}
								icon={item.icon}
								onClick={item.onClick}
							/>
						))}
				</View>
			</View>

			{!isLogged && (
				<View className='px-4 flex flex-col gap-2 mt-4'>
					<CustomButton
						label={t('home.labelEnter', 'ENTRAR')}
						className='uppercase !h-11 rounded-full'
						textClassName='font-semibold'
						onPress={() => navigate(PAGES.SIGNIN)}
					/>
					<CustomButton
						variant='outlined'
						label={t('home.labelCreateAccount', 'CRIAR CONTA')}
						className='uppercase !h-11 rounded-full'
						textClassName='font-semibold'
						onPress={() => navigate(PAGES.SIGNUP)}
					/>
				</View>
			)}

			<View className='flex justify-center w-full items-center mt-8 mb-4'>
				<PoweredBy />
			</View>

			<BottomInset />
		</Page>
	)
}
