import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { Page } from 'eitri-luminus'
import { CustomButton, FloatNotification, Loading, BottomInset } from 'eitri-shopping-di-santinni-shared'
import AvailableLimitCard from '../components/AvailableLimitCard/AvailableLimitCard'
import BenefitBanner from '../components/BenefitBanner/BenefitBanner'
import CardHeader from '../components/CardHeader/CardHeader'
import InvoiceSummaryCard from '../components/InvoiceSummaryCard/InvoiceSummaryCard'
import OfferProducts from '../components/OfferProducts/OfferProducts'
import ShortcutCard from '../components/ShortcutCard/ShortcutCard'
import VirtualCard from '../components/VirtualCard/VirtualCard'
import { getCardLimit, getCurrentInvoice, getVirtualCard } from '../services/CardService'
import { addToWishlist, getWishlist, removeItemFromWishlist } from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { getOfferProducts, OFFERS_COLLECTION_ID } from '../services/ProductService'
import CardsIcon from '../assets/icons/cards.svg'
import InvoicesIcon from '../assets/icons/shortcut-invoices.svg'
import LimitIcon from '../assets/icons/shortcut-limit.svg'
import SecurityIcon from '../assets/icons/shortcut-security.svg'
import PresentImage from '../assets/images/present.svg'

// TODO: definir destino (link/rota) dos atalhos
const SHORTCUTS = [
	{ id: 'invoices', label: 'Faturas', icon: InvoicesIcon, onPress: () => navigate(PAGES.MY_INVOICES) },
	{ id: 'limit', label: 'Limite', icon: LimitIcon, onPress: () => navigate(PAGES.CARD_LIMIT) },
	{ id: 'virtualCard', label: 'Cartão Virtual', icon: CardsIcon, onPress: () => {} },
	{ id: 'security', label: 'Segurança', icon: SecurityIcon, onPress: () => {} }
]

export default function MyCard() {
	const { t } = useTranslation()

	const [card, setCard] = useState(null)
	const [invoice, setInvoice] = useState(null)
	const [limit, setLimit] = useState(null)
	const [offers, setOffers] = useState(null)
	const [wishlistIds, setWishlistIds] = useState([])
	const [showCopiedToast, setShowCopiedToast] = useState(false)

	useEffect(() => {
		loadCard()
		loadInvoice()
		loadLimit()
		loadOffers()
	}, [])

	const loadCard = async () => {
		try {
			const data = await getVirtualCard()

			setCard(data)
		} catch (e) {
			console.error('loadCard error:', e)
		}
	}

	const loadInvoice = async () => {
		try {
			const data = await getCurrentInvoice()

			setInvoice(data)
		} catch (e) {
			console.error('loadInvoice error:', e)
		}
	}

	const loadLimit = async () => {
		try {
			const data = await getCardLimit()

			setLimit(data)
		} catch (e) {
			console.error('loadLimit error:', e)
		}
	}

	const loadOffers = async () => {
		try {
			const data = await getOfferProducts()

			setOffers(data)
			const wishlist = await getWishlist()

			setWishlistIds(wishlist.map(item => String(item.productId)))
		} catch (e) {
			console.error('loadOffers error:', e)
		}
	}

	const onPressSeeInvoice = () => navigate(PAGES.MY_INVOICES)

	// TODO: definir destino (link/rota) do botão
	const onPressBenefit = () => {}

	const onPressSeeMoreOffers = () => {
		Eitri.nativeNavigation.open({
			slug: 'home',
			initParams: {
				route: 'ProductCatalog',
				title: t('myCard.offers.title', 'Ofertas para você'),
				params: { facets: [{ key: 'productClusterIds', value: String(OFFERS_COLLECTION_ID) }] }
			}
		})
	}

	// TODO: definir destino (link/rota) do produto
	const onPressOffer = () => {}

	const onToggleWishlist = async product => {
		const productId = String(product.id)

		try {
			if (wishlistIds.includes(productId)) {
				const removed = await removeItemFromWishlist(productId)

				if (removed) setWishlistIds(ids => ids.filter(id => id !== productId))
			} else {
				await addToWishlist(productId, product.name, product.itemId)

				setWishlistIds(ids => [...ids, productId])
			}
		} catch (e) {
			console.error('onToggleWishlist error:', e)
		}
	}

	const onPressCopyCode = () => {
		Eitri.clipboard.setText({ text: card.number.replace(/\D/g, '') })

		setShowCopiedToast(true)
	}

	// TODO: definir o que será compartilhado (dados do cartão têm CVV, sensível) e como
	const onPressShare = () => {}

	const onBack = () => Eitri.navigation.back()

	return (
		<Page
			title={t('myCard.pageTitle', 'Meu Cartão')}
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<Loading
				isLoading={!card || !invoice || !limit}
				fullScreen={true}
			/>

			<View className='flex flex-col gap-[30px] px-4 pt-5 bg-snow'>
				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('myCard.virtualCardTitle', 'Cartão Virtual')}
				</Text>

				<View className='flex flex-col gap-[10px]'>
					{card && (
						<VirtualCard
							name={card.name}
							number={card.number}
							expiry={card.expiry}
							cvv={card.cvv}
						/>
					)}

					<CustomButton
						label={t('myCard.copyCode', 'Copiar código')}
						backgroundColor='bg-[#C8102E]'
						className='!h-[34px]'
						textClassName='text-xs uppercase tracking-[0.24px]'
						onPress={onPressCopyCode}
					/>

					<CustomButton
						outlined
						className='!h-[34px] !border-[#C8102E]'
						onPress={onPressShare}>
						<Text className='text-xs font-bold uppercase tracking-[0.24px] text-[#C8102E]'>
							{t('myCard.share', 'Compartilhar')}
						</Text>
					</CustomButton>
				</View>

				<Text className='text-lg font-semibold leading-6 tracking-[0.36px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('myCard.invoiceTitle', 'Fatura')}
				</Text>

				{invoice && (
					<InvoiceSummaryCard
						amount={invoice.amount}
						dueDay={invoice.dueDay}
						onPressSeeInvoice={onPressSeeInvoice}
					/>
				)}

				{limit && (
					<AvailableLimitCard
						totalLimit={limit.totalLimit}
						usedLimit={limit.usedLimit}
					/>
				)}

				<View className='flex flex-row justify-between w-full'>
					{SHORTCUTS.map(shortcut => (
						<ShortcutCard
							key={shortcut.id}
							icon={shortcut.icon}
							label={t(`myCard.shortcuts.${shortcut.id}`, shortcut.label)}
							onPress={shortcut.onPress}
						/>
					))}
				</View>

				<BenefitBanner
					title={t('myCard.benefit.title', '10% OFF no mês do seu aniversário')}
					actionLabel={t('myCard.benefit.action', 'Ver benefício')}
					image={PresentImage}
					onPressAction={onPressBenefit}
				/>

				{offers?.length > 0 && (
					<OfferProducts
						products={offers}
						wishlistIds={wishlistIds}
						onPressSeeMore={onPressSeeMoreOffers}
						onPressProduct={onPressOffer}
						onToggleWishlist={onToggleWishlist}
					/>
				)}

				<BottomInset />
			</View>

			<FloatNotification
				showNotification={showCopiedToast}
				title={t('myCard.codeCopied', 'Código copiado!')}
				onCloseNotification={() => setShowCopiedToast(false)}
				functionExitNotification={() => setShowCopiedToast(false)}
				toast
			/>
		</Page>
	)
}
