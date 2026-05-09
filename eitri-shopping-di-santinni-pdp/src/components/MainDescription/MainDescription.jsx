import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import share from '../../assets/images/share-red.svg'
import wishlist from '../../assets/images/wishlist-heart.svg'
import { formatAmount, formatPrice } from '../../utils/utils'

const Star = ({ filled }) => (
	<View>
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='13'
			height='12'
			viewBox='0 0 13 12'
			fill='none'>
			<path
				d='M6.24563 9.8425L2.38812 11.8706L3.125 7.575L0 4.53312L4.3125 3.90812L6.24125 0L8.17 3.90812L12.4825 4.53312L9.3575 7.575L10.0944 11.8706L6.24563 9.8425Z'
				fill={filled ? '#C8102E' : '#FFF'}
				stroke='#C8102E'
				strokeWidth='0.5'
			/>
		</svg>
	</View>
)

export default function MainDescription(props) {
	const { product, currentSku, locale, currency } = props

	console.log('product: ', product)
	console.log('currentSku: ', currentSku)

	const { t } = useTranslation()
	const [averageRating, setAverageRating] = useState(3)

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
		console.log('click on handleShare')
	}

	const handleWishlist = () => {
		console.log('click on handleWishlist')
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
					<View className='flex items-center gap-0.5'>
						{[1, 2, 3, 4, 5].map(star => (
							<Star
								key={star}
								filled={star <= averageRating}
							/>
						))}
					</View>
					<Text className='text-xs underline tracking-[0.24px] text-red-700'>123</Text>
				</View>
				<View className='flex gap-2 items-center'>
					<View onClick={handleShare}>
						<Image src={share} />
					</View>
					<View onClick={handleWishlist}>
						<Image src={wishlist} />
					</View>
				</View>
			</View>
		</View>
	)

	return (
		<View className='flex flex-col w-full gap-4'>
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
