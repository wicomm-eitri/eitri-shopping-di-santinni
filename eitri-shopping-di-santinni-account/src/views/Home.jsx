import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, CustomButton, HeaderContentWrapper, HeaderText, Loading } from 'eitri-shopping-di-santinni-shared'
import InfoCard from '../components/InfoCard/InfoCard'
import LoginCard from '../components/LoginCard/LoginCard'
import PoweredBy from '../components/PoweredBy/PoweredBy'
import ProfileCardButton from '../components/ProfileCardButton/ProfileCardButton'
import { startConfigure } from '../services/AppService'
import { doLogout, getCustomerData, isLoggedIn } from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { sendScreenView } from '../services/TrackingService'
import bookmarkIcon from '../assets/images/bookmark-01.svg'
import boxIcon from '../assets/images/box-01.svg'
import userIcon from '../assets/images/user.svg'

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
			icon: userIcon,
			isVisible: true,
			onClick: () => {
				isLogged
					? navigate(PAGES.EDIT_PROFILE, { customerData })
					: navigate(PAGES.SIGNIN, { redirectTo: PAGES.EDIT_PROFILE })
			}
		},
		{
			label: t('home.labelMyOrders', 'Meus pedidos'),
			icon: boxIcon,
			isVisible: isLogged,
			onClick: () => {
				isLogged ? navigate(PAGES.ORDER_LIST) : navigate(PAGES.SIGNIN, { redirectTo: PAGES.ORDER_LIST })
			}
		},
		{
			label: t('home.labelMyFavorites', 'Meus favoritos'),
			icon: bookmarkIcon,
			isVisible: isLogged,
			onClick: () => {
				isLogged ? navigate(PAGES.WISH_LIST) : navigate(PAGES.SIGNIN, { redirectTo: PAGES.WISH_LIST })
			}
		},
		{
			label: t('home.labelExchangesReturns', 'Trocas e devoluções'),
			icon: userIcon,
			isVisible: true,
			onClick: handlePlaceholderItem
		},
		{
			label: t('home.labelSupport', 'Suporte'),
			icon: boxIcon,
			isVisible: true,
			onClick: handlePlaceholderItem
		},
		{
			label: t('home.labelStores', 'Nossas lojas'),
			icon: bookmarkIcon,
			isVisible: true,
			onClick: handlePlaceholderItem
		}
	]

	useEffect(() => {
		init()
		sendScreenView('Perfil', 'Home')

		Eitri.navigation.setOnResumeListener(() => {
			init()
		})
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

		sendPageView(PAGE)
	}

	const loadMe = async () => {
		const customerData = await getCustomerData()

		setCustomerData(customerData)
	}

	const _doLogout = async () => {
		setIsLoading(true)
		await doLogout()
		init()
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
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			{!isLoading && (isLogged ? <InfoCard customerData={customerData} /> : <LoginCard />)}

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

			{isLogged ? (
				<View className='px-4 py-6 mt-4'>
					<CustomButton
						variant='outlined'
						className='uppercase !h-11 rounded-full'
						textClassName='font-semibold text-red-700'
						label={t('home.labelLeave', 'Sair')}
						onPress={_doLogout}
					/>
				</View>
			) : (
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
