import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { Vtex } from 'eitri-shopping-vtex-shared'
import share from '../../assets/images/share-red.svg'
import star from '../../assets/images/star.svg'
import starFilled from '../../assets/images/starFilled.svg'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { addToWishlist, productOnWishlist, removeItemFromWishlist } from '../../services/customerService'
import { formatAmount, formatPrice } from '../../utils/utils'
import WishlistIcon from '../WishlistIcon/WishlistIcon'

const Star = ({ filled }) => (
	<View>
		<Image
			src={filled ? starFilled : star}
			className='w-4 h-4'
		/>
	</View>
)

export default function MainDescription(props) {
	const { product, currentSku, locale, currency } = props

	const { t } = useTranslation()
	const { cart } = useLocalShoppingCart()

	const [averageRating, setAverageRating] = useState(3)
	const [loadingWishlist, setLoadingWishlist] = useState(true)
	const [itemWishlistId, setItemWishlistId] = useState(-1)
	const [itemOnWishlist, setItemOnWishlist] = useState(false)

	useEffect(() => {
		if (product?.productId) {
			checkIfIsFavorite(product.productId)
		}

		Eitri.navigation.addOnResumeListener(() => {
			if (product?.productId) {
				checkIfIsFavorite(product.productId)
			}
		})
	}, [product?.productId])

	const count = useRef(5)

	const discoverInstallments = (item, typeReturn) => {
		try {
			const mainSeller = item?.sellers?.find(seller => seller.sellerDefault)

			if (mainSeller) {
				const betterInstallment = mainSeller.commertialOffer.Installments.reduce((acc, installment) => {
					if (!acc) {
						acc = installment

						return acc
					} else {
						if (installment.NumberOfInstallments > acc.NumberOfInstallments) {
							acc = installment
						}

						return acc
					}
				}, null)

				if (betterInstallment.NumberOfInstallments === 1) return ''

				if (typeReturn === 'boolean') return true

				return (
					<Text className='text-sm text-gray-500 font-semibold leading-6 tracking-[0.24px]'>
						{t('mainDescription.txtUntil', 'ou')}
						<Text className='text-sm px-0.5 text-success font-semibold leading-6 tracking-[0.24px]'>
							{betterInstallment.NumberOfInstallments}x {t('mainDescription.txtOf', 'de')}{' '}
							{formatAmount(betterInstallment.Value, locale, currency)}
						</Text>
						{t('mainDescription.txtWithoutInterest', 'sem juros')}
					</Text>
				)
			}

			return ''
		} catch (error) {
			return ''
		}
	}

	const copyCheckoutId = () => {
		if (count.current > 0) {
			count.current -= 1

			return
		}

		Eitri.clipboard.setText({
			text: product?.productId
		})
		count.current = 5
	}

	const mainSeller = currentSku?.sellers?.find(seller => seller.sellerDefault) || currentSku?.sellers?.[0]

	const handleShare = () => {
		// TODO Anthonius: Vtex.configs.domain não funciona, pegar domain de outra forma
		const url = `${Vtex?.configs?.domain}/${product?.linkText}/p?utm_source=eitri-shop-source`

		Eitri.share.link({
			url: url
		})
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

	const handleWishlist = async () => {
		if (!itemOnWishlist) {
			try {
				setItemOnWishlist(true)
				await addToWishlist(product?.productId, product?.productName, product?.items[0]?.itemId)
			} catch (e) {
				console.error('handleSaveFavorite: Error', e)
				setItemOnWishlist(false)
			}
		} else {
			try {
				setItemOnWishlist(false)
				await removeItemFromWishlist(product?.productId)
			} catch (e) {
				console.error('handleSaveFavorite: Error', e)
				setItemOnWishlist(true)
			}
		}
	}

	const Price = () => (
		<View>
			<View className='flex flex-col gap-0.5'>
				{mainSeller?.commertialOffer?.Price < mainSeller?.commertialOffer?.ListPrice && (
					<Text className='text-gray-500 text-sm leading-6 tracking-[0.56px] text-right capitalize line-through'>
						{formatPrice(mainSeller?.commertialOffer?.ListPrice)}
					</Text>
				)}
				<Text className='text-red-700 leading-7 tracking-[0.48px] font-semibold text-2xl'>
					{formatPrice(mainSeller?.commertialOffer?.Price)}
				</Text>
			</View>
			{discoverInstallments(currentSku, 'boolean') && discoverInstallments(currentSku)}
		</View>
	)

	const ProductNameAndActions = () => (
		<View className='flex flex-col gap-3'>
			<Text className='text-2xl font-outfit font-semibold uppercase tracking-[0.48px] leading-6'>
				{product.productName || t('mainDescription.txtNoName', 'Produto sem nome')}
			</Text>
			<View className='flex justify-between'>
				<View className='flex gap-2 items-center'>
					{/* avaliações ocultadas por enquanto */}
					{/* <View className='flex items-center gap-0.5'>
						{[1, 2, 3, 4, 5].map(star => (
							<Star
								key={star}
								filled={star <= averageRating}
							/>
						))}
					</View>
					<Text className='text-xs underline tracking-[0.24px] text-red-700'>123</Text> */}
				</View>
				<View className='flex gap-2 items-center'>
					<View onClick={handleShare}>
						<Image src={share} />
					</View>
					<View onClick={handleWishlist}>
						<WishlistIcon filled={itemOnWishlist} />
					</View>
				</View>
			</View>
		</View>
	)

	return (
		<View className='flex flex-col w-full gap-4'>
			{/* TODO Anthonius: Verificar avaliações - como implementar */}
			<ProductNameAndActions />
			<Price />
			{/* <View>
				<View onClick={copyCheckoutId}>
					<Text className='text-2xl font-outfit font-semibold uppercase tracking-[0.48px] leading-6'>
						{product.productName}
					</Text>
				</View>
				{product?.productReference && (
					<>
						<Text className='text-neutral-content pt-1 text-gray-400'>
							{`ref ${product?.productReference}`}
						</Text>
					</>
				)}
			</View> */}

			{/* <View
				direction='column'
				gap={2}>
				{mainSeller?.commertialOffer?.Price < mainSeller?.commertialOffer?.ListPrice && (
					<Text className='text-sm text-neutral-content line-through'>
						{formatPrice(mainSeller?.commertialOffer?.ListPrice)}
					</Text>
				)}
				<View>
					<Text className='text-primary font-bold text-xl'>
						{formatPrice(mainSeller?.commertialOffer?.Price)}
					</Text>
				</View>

				{discoverInstallments(currentSku) && (
					<Text className='text-sm text-neutral-content'>{discoverInstallments(currentSku)}</Text>
				)}
			</View> */}
		</View>
	)
}
