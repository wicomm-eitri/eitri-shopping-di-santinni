import { useTranslation } from 'eitri-i18n'
import { formatAmountInCents } from '../../utils/utils'
import ModalConfirm from '../ModalConfirm/ModalConfirm'
import Quantity from '../Quantity/Quantity'

export default function CartItem(props) {
	const { item, onChangeQuantityItem, message, handleRemoveCartItem, onAddOfferingToCart, onRemoveOfferingFromCart } =
		props

	const { t } = useTranslation()

	const [showModalRemoveItem, setShowModalRemoveItem] = useState(false)
	const [modalRemoveItemText, setModalRemoveItemText] = useState('')
	const [loadingItemQuantity, setLoadingItemQuantity] = useState(false)

	const resizedImageUrl = item.imageUrl.replace(/\/(\d+)-\d+-\d+\//, '/$1-200-200/')

	const { baseName, size, color } = (() => {
		const raw = (item.name || '').trim()

		if (!raw) return { baseName: '', size: '', color: '' }

		const words = raw.split(/\s+/)
		const sizeRegex = /^(PP|P|M|G|GG|XS|S|L|XL|XXL|XXXL|U|[0-9]{1,3})$/i

		let detectedSize = ''
		let detectedColor = ''
		let nameParts = [...words]
		const last = words[words.length - 1]

		if (sizeRegex.test(last)) {
			detectedSize = last.toUpperCase()
			nameParts.pop()
		}

		if (nameParts.length > 0) {
			const lastPart = nameParts[nameParts.length - 1]
			const secondLastPart = nameParts.length > 1 ? nameParts[nameParts.length - 2] : null
			const isUpper = s => /^[A-ZÀ-Ÿ0-9-]+$/.test(s.replace(/\W+/g, ''))

			if (secondLastPart && isUpper(secondLastPart) && isUpper(lastPart)) {
				detectedColor = `${secondLastPart} ${lastPart}`
				nameParts.splice(-2, 2)
			} else {
				detectedColor = lastPart
				nameParts.pop()
			}
		}

		const base = nameParts.join(' ').trim()

		return { baseName: base || raw, size: detectedSize, color: detectedColor }
	})()

	const handleQuantityOfItemsCart = async quantityToUpdate => {
		try {
			setLoadingItemQuantity(true)
			await onChangeQuantityItem(item.quantity + quantityToUpdate)
			setLoadingItemQuantity(false)
		} catch (e) {
			console.error('Cart: handleQuantityOfItemsCart Error', e)
			setLoadingItemQuantity(false)
		}
	}

	const handleRemoveCartItemIntention = () => {
		setModalRemoveItemText(`Deseja remover ${item.name} do carrinho?`)
		setShowModalRemoveItem(true)
	}

	const removeCartItem = () => {
		handleRemoveCartItem()
		setShowModalRemoveItem(false)
	}

	const handleItemOffer = offeringId => {
		if (offerIsBundled(offeringId)) {
			onRemoveOfferingFromCart(offeringId)

			return
		}

		onAddOfferingToCart(offeringId)
	}

	const offerIsBundled = offeringId => item?.bundleItems?.some(o => o.id === offeringId)

	return (
		<View>
			<View className='flex gap-4'>
				<View className='flex-shrink-0'>
					<Image
						className='w-[107px] h-[134px] object-cover'
						src={resizedImageUrl}
					/>
				</View>

				<View className='flex flex-col gap-2'>
					{item.availability !== 'available' && (
						<View className='mb-2 p-2 bg-red-50 border border-red-200 rounded'>
							<Text className='text-sm text-red-600 font-medium'>
								{item.availability === 'cannotBeDelivered'
									? t('cartItem.cannotBeDelivered', 'Este item não pode ser entregue')
									: t('cartItem.notAvailable', 'Este item não está disponível')}
							</Text>
						</View>
					)}

					<View className='flex justify-between items-start'>
						<Text className='text-xs text-primary pr-2'>{item.name}</Text>
					</View>

					<View className='flex flex-col gap-1'>
						{size && (
							<Text className='text-[10px] text-primary'>
								Tamanho:<Text className='text-gray-500 font-light'> {size}</Text>
							</Text>
						)}
						{color && (
							<Text className='text-[10px] text-primary'>
								Cor:<Text className='text-gray-500 font-light'> {color}</Text>
							</Text>
						)}
					</View>

					{/* Preço */}
					<View className='flex items-center gap-2 my-2'>
						<Text className='text-xs font-medium text-primary'>{formatAmountInCents(item.price)}</Text>

						{item?.listPrice && item.price !== item.listPrice && (
							<Text className='line-through font-light text-gray-500 text-[10px]'>
								{formatAmountInCents(item.listPrice)}
							</Text>
						)}
					</View>

					{/* Seletor de Quantidade */}
					<View className='flex items-center gap-2 justify-between'>
						<Quantity
							quantity={item.quantity}
							handleItemQuantity={handleQuantityOfItemsCart}
							loadingQuantity={loadingItemQuantity}
						/>

						<View onClick={handleRemoveCartItemIntention}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='text-gray-400'>
								<polyline points='3 6 5 6 21 6'></polyline>
								<path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
								<line
									x1='10'
									y1='11'
									x2='10'
									y2='17'></line>
								<line
									x1='14'
									y1='11'
									x2='14'
									y2='17'></line>
							</svg>
						</View>
					</View>
				</View>
			</View>

			{item?.offerings?.length > 0 && !message && (
				<View className='mt-4 pt-3 border-t border-gray-300'>
					{item?.offerings.map(offering => (
						<View
							key={offering.id}
							onClick={() => handleItemOffer(offering.id)}
							className='flex items-top justify-between gap-4'>
							<View className='flex items-top gap-3'>
								<Toggle
									defaultChecked={offerIsBundled(offering.id)}
									name='terms'
									value={1}
								/>
								<View>
									<Text className='text-sm text-gray-700'>{offering?.name}</Text>
								</View>
							</View>
							<Text className='text-sm font-medium text-gray-900'>
								{offering?.price ? formatAmountInCents(offering.price) : ''}
							</Text>
						</View>
					))}
				</View>
			)}

			{message && (
				<View className='flex flex-col justify-center items-center my-2'>
					<Text className='text-sm text-center text-warning'>
						{message.text || t('cartItem.txtMessageUnavailable', 'Este produto não está disponível!')}
					</Text>
				</View>
			)}

			<ModalConfirm
				text={modalRemoveItemText}
				showModal={showModalRemoveItem}
				closeModal={() => setShowModalRemoveItem(false)}
				removeItem={removeCartItem}
			/>
		</View>
	)
}
