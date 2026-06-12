import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText, Loading } from 'eitri-shopping-di-santinni-shared'
import NoItem from '../components/NoItem/NoItem'
import WishlistItem from '../components/WishlistItem/WishlistItem'
import { getWishlist, removeFromWishlist } from '../services/CustomerService'
import { sendScreenView } from '../services/TrackingService'
import heartIcon from '../assets/icons/heart.svg'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'

export default function Wishlist(props) {
	const { t } = useTranslation()

	const [wishlistItems, setWishlistItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const [hasBackButton, setHasBackButton] = useState(false)

	useEffect(() => {
		startPage()
		start()

		addonUserTappedActiveTabListener()
		sendScreenView('Lista de desejos', 'Wishlist')

		Eitri.navigation.addOnResumeListener(() => start())
	}, [])

	const start = async () => {
		try {
			setIsLoading(true)
			const result = await getWishlist()

			setWishlistItems(result)
		} catch (e) {
			console.error('ERROR AO CARREGAR WISHLIST', e)
			setWishlistItems([])
		} finally {
			setIsLoading(false)
		}
	}

	const startPage = async () => {
		const startParams = await Eitri.getInitializationInfos()

		if (!startParams?.tabIndex || startParams?.tabIndex === 4 || startParams?.tabIndex === '4') {
			setHasBackButton(true)
		}
	}

	const onRemoveFromWishList = async id => {
		setIsLoading(true)

		try {
			await removeFromWishlist(id)
			setWishlistItems(prevItems => prevItems.filter(item => item.id !== id))
		} catch (error) {
			console.error('Erro ao remover item da wishlist', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Page title={t('wishlist.pageTitle', 'Wishlist')}>
			<HeaderContentWrapper>
				{hasBackButton && <HeaderReturn />}

				<HeaderText text={t('wishlist.myFavorites', 'Meus favoritos')} />
			</HeaderContentWrapper>

			<Loading
				isLoading={isLoading}
				fullScreen
			/>

			<View className='grid grid-cols-2 gap-x-2 gap-y-4 p-4'>
				{wishlistItems && wishlistItems.length > 0
					? wishlistItems.map(item => (
							<WishlistItem
								key={item.id}
								productId={item.skuId}
								onRemoveFromWishList={() => onRemoveFromWishList(item.id)}
							/>
						))
					: null}
			</View>

			{wishlistItems.length === 0 && !isLoading && (
				<NoItem
					icon={heartIcon}
					title={t('wishlist.noItems', 'Você não possui itens salvos')}
					subtitle={t(
						'wishlist.noFavoritesSubtitle',
						'Quando você favoritar um produto, ele será listado aqui.'
					)}
				/>
			)}

			<BottomInset />
		</Page>
	)
}
