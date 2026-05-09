import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { HeaderContentWrapper, HeaderReturn, HeaderText, Loading } from 'eitri-shopping-di-santinni-shared'
import ActionButton from '../components/ActionButton/ActionButton'
import CartItemsContent from '../components/CartItemsContent/CartItemsContent'
import CartSummary from '../components/CartSummary/CartSummary'
import Coupon from '../components/Coupon/Coupon'
import Freight from '../components/Freight/Freight'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { startConfigure } from '../services/AppService'
import { saveCartIdOnStorage } from '../services/cartService'
import { sendPageView } from '../services/trackingService'
import CloseIcon from '../assets/icons/close-cart.svg'

export default function Home(props) {
	const { t } = useTranslation()
	const { cart, startCart } = useLocalShoppingCart()

	const [appIsLoading, setAppIsLoading] = useState(true)
	const [openWithBottomBar, setOpenWithBottomBar] = useState(false)

	useEffect(() => {
		startHome()

		Eitri.navigation.setOnResumeListener(() => startHome())
	}, [])

	useEffect(() => {
		if (cart && cart.items.length === 0) {
			Eitri.navigation.navigate({
				path: 'EmptyCart',
				state: { openWithBottomBar },
				replace: true
			})
		}
	}, [cart])

	const startHome = async () => {
		const startParams = await Eitri.getInitializationInfos()

		setOpenWithBottomBar(startParams?.tabIndex)

		await startConfigure()
		await loadCart()

		setAppIsLoading(false)
		sendPageView('Home')
	}

	const loadCart = async () => {
		const startParams = await Eitri.getInitializationInfos()

		if (startParams?.orderFormId) await saveCartIdOnStorage(startParams?.orderFormId)

		return startCart()
	}

	return (
		<Page title={t('home.title', 'Carrinho')}>
			<HeaderContentWrapper className={openWithBottomBar ? 'justify-center' : 'justify-between'}>
				{!openWithBottomBar && <HeaderReturn />}

				<HeaderText
					text={`${t('home.title', 'Sacola')} (${cart?.items?.length || 0})`}
					className='text-red-700'
				/>

				{!openWithBottomBar && (
					<Image
						src={CloseIcon}
						alt='Ícone de fechar carrinho'
						className='w-5 h-5'
					/>
				)}
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={appIsLoading}
			/>

			{cart && (
				<>
					<View className='py-4 flex flex-col gap-4'>
						<CartItemsContent />

						<Coupon />

						<Freight />

						<CartSummary />
					</View>

					<ActionButton />
				</>
			)}
		</Page>
	)
}
