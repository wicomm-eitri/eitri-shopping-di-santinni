import { useTranslation } from 'eitri-i18n'
import TrashIcon from '../../assets/icons/trash.svg'
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

		if (detectedColor && /^[0-9./\s-]+$/.test(detectedColor.trim())) {
			detectedSize = detectedColor
			detectedColor = ''
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
						className='w-[107px] h-auto'
						src={resizedImageUrl}
					/>
				</View>

				<View className='flex flex-col gap-2 w-full'>
					{item.availability !== 'available' && (
						<View className='mb-2 p-2 bg-red-50 border border-red-200 rounded flex items-center justify-center'>
							<Text className='w-full text-sm text-red-600 font-medium text-center'>
								{item.availability === 'cannotBeDelivered'
									? t('cartItem.cannotBeDelivered', 'Este item não pode ser entregue')
									: t('cartItem.notAvailable', 'Este item não está disponível')}
							</Text>
						</View>
					)}

					<View className='flex justify-between gap-2'>
						<Text className='text-sm pr-2'>{item.name}</Text>

						<View onClick={handleRemoveCartItemIntention}>
							<Image
								src={TrashIcon}
								className='min-w-[13px]'
								alt='Ícone de lixeira'
							/>
						</View>
					</View>

					<View className='flex flex-col gap-1'>
						{size && (
							<Text className='text-sm'>
								Tamanho:<Text className='text-gray-500 font-light'> {size}</Text>
							</Text>
						)}
						{color && (
							<Text className='text-sm'>
								Cor:<Text className='text-gray-500 font-light'> {color}</Text>
							</Text>
						)}
					</View>

					{/* Preço */}
					<View className='flex items-center gap-2 my-2'>
						<Text className='text-xs font-medium'>{formatAmountInCents(item.price)}</Text>

						{item?.listPrice && item.price !== item.listPrice && (
							<Text className='line-through font-light text-gray-500 text-sm'>
								{formatAmountInCents(item.listPrice)}
							</Text>
						)}
					</View>

					{/* Seletor de Quantidade */}
					<Quantity
						quantity={item.quantity}
						handleItemQuantity={handleQuantityOfItemsCart}
						loadingQuantity={loadingItemQuantity}
					/>
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

			{/* {message && (
				<View className='flex flex-col justify-center items-center my-2'>
					<Text className='text-sm text-center text-warning'>
						{message.text || t('cartItem.txtMessageUnavailable', 'Este produto não está disponível!')}
					</Text>
				</View>
			)} */}

			<ModalConfirm
				text={modalRemoveItemText}
				showModal={showModalRemoveItem}
				closeModal={() => setShowModalRemoveItem(false)}
				removeItem={removeCartItem}
			/>
		</View>
	)
}
