import Eitri from 'eitri-bifrost'
import {
	HeaderCart,
	HeaderContentWrapper,
	HeaderReturn,
	HeaderSearchIcon
} from 'eitri-shopping-di-santinni-shared'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { addToWishlist, productOnWishlist, removeItemFromWishlist } from '../../services/customerService'

export default function Header(props) {
	const { product, configLoaded } = props
	const { cart } = useLocalShoppingCart()

	const [loadingWishlist, setLoadingWishlist] = useState(true)
	const [itemWishlistId, setItemWishlistId] = useState(-1)
	const [itemOnWishlist, setItemOnWishlist] = useState(false)

	useEffect(() => {
		if (product && configLoaded) {
			checkIfIsFavorite(product?.productId)
		}
	}, [product, configLoaded])

	const shareLink = () => {
		const url = `${Vtex?.configs?.domain}/${product?.linkText}/p?utm_source=eitri-shop-source`

		Eitri.share.link({
			url: url
		})
	}

	const handleSaveFavorite = async () => {
		if (itemWishlistId === -1) {
			try {
				setItemOnWishlist(true)
				const result = await addToWishlist(product?.productId, product?.productName, product?.items[0]?.itemId)

				setItemWishlistId(result?.data?.addToList)
			} catch (e) {
				console.error('handleSaveFavorite: Error', e)
				setItemOnWishlist(false)
			}
		} else {
			try {
				setItemOnWishlist(false)
				await removeItemFromWishlist(itemWishlistId)
				setItemWishlistId(-1)
			} catch (e) {
				console.error('handleSaveFavorite: Error', e)
				setItemOnWishlist(true)
			}
		}
	}

	const checkIfIsFavorite = async productId => {
		setLoadingWishlist(true)
		const { inList, listId } = await productOnWishlist(productId)

		if (inList) {
			setItemWishlistId(listId)
			setItemOnWishlist(true)
		}

		setLoadingWishlist(false)
	}

	const goToSearch = useCallback(() => {
		Eitri.navigation.open({
			slug: 'home',
			initParams: {
				route: 'Search'
			}
		})
	}, [])

	return (
		<HeaderContentWrapper containerClassName='bg-white'  className='bg-white justify-between'>
			<View className='flex gap-3'>
				<HeaderReturn />
			</View>
			<View className='flex gap-4'>
				{/* <HeaderWishList
					filled={itemOnWishlist}
					onClick={handleSaveFavorite}
					className={loadingWishlist && itemOnWishlist ? 'text-gray-300' : ''}
				/>
				<HeaderShare onClick={shareLink} /> */}
				<HeaderSearchIcon onClick={goToSearch} />
				<HeaderCart cart={cart} />
			</View>
		</HeaderContentWrapper>
	)
}
