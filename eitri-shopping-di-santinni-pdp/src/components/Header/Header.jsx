import Eitri from 'eitri-bifrost'
import { HeaderCart, HeaderContentWrapper, HeaderReturn, HeaderSearchIcon } from 'eitri-shopping-di-santinni-shared'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { addToWishlist, productOnWishlist, removeItemFromWishlist } from '../../services/customerService'

export default function Header(props) {
	const { product, configLoaded, initialWishlistInfo } = props
	const { cart } = useLocalShoppingCart()

	const [loadingWishlist, setLoadingWishlist] = useState(!initialWishlistInfo)
	const [itemWishlistId, setItemWishlistId] = useState(initialWishlistInfo?.listId || -1)
	const [itemOnWishlist, setItemOnWishlist] = useState(initialWishlistInfo?.inList || false)

	useEffect(() => {
		if (initialWishlistInfo) {
			setItemOnWishlist(initialWishlistInfo.inList)
			setItemWishlistId(initialWishlistInfo.listId || -1)
			setLoadingWishlist(false)
		} else if (product && configLoaded) {
			checkIfIsFavorite(product?.productId)
		}

		Eitri.navigation.addOnResumeListener(() => {
			if (product && configLoaded) {
				checkIfIsFavorite(product?.productId)
			}
		})
	}, [product, configLoaded, initialWishlistInfo])

	const shareLink = () => {
		const url = `${Vtex?.configs?.domain}/${product?.linkText}/p?utm_source=eitri-shop-source`

		Eitri.share.link({
			url: url
		})
	}

	const handleSaveFavorite = async () => {
		if (!itemOnWishlist) {
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
				await removeItemFromWishlist(product?.productId)
				setItemWishlistId(-1)
			} catch (e) {
				console.error('handleSaveFavorite: Error', e)
				setItemOnWishlist(true)
			}
		}
	}

	const checkIfIsFavorite = async (productId, isRetry = false) => {
		setLoadingWishlist(true)
		const { inList, listId } = await productOnWishlist(productId)

		if (inList) {
			setItemOnWishlist(true)
			setItemWishlistId(listId)
		} else {
			if (!isRetry) {
				setTimeout(() => checkIfIsFavorite(productId, true), 1000)
			} else {
				setItemOnWishlist(false)
				setItemWishlistId(-1)
			}
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
		<HeaderContentWrapper
			containerClassName='bg-white'
			className='bg-white justify-between'>
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
