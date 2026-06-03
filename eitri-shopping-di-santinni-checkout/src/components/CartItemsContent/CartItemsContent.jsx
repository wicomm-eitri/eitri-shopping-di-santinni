import { useLocalShoppingCart } from '../../providers/LocalCart'
import { formatAmountInCents } from '../../utils/utils'
import CartItem from '../CartItem/CartItem'

export default function CartItemsContent(props) {
	const { cart, changeQuantity, removeItem, addItemOffer, removeItemOffer } = useLocalShoppingCart()

	const [cartItems, setCartItems] = useState([])
	const [total, setTotal] = useState(0)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (cart) {
			setCartItems([...(cart?.items || [])])
		}
	}, [cart])

	useEffect(() => {
		if (!cart) return

		loadItems()

		const finalTotal = cart?.totalizers?.reduce((acc, totalizer) => acc + totalizer.value, 0)
		setTotal(finalTotal)
	}, [cart])

	const loadItems = async () => {
		try {
			if (!cart?.items) return
			setIsLoading(true)

			const detailed = await Promise.all(
				cart.items.map(async item => {
					const productId = item.productId
					const skuId = item.id

					if (!productCache.current[productId]) {
						productCache.current[productId] = getProductById(productId).catch(err => {
							delete productCache.current[productId]
							throw err
						})
					}

					const product = await productCache.current[productId]
					if (!product) return { ...item, variationEntries: [] }

					const sku = product.items?.find(i => i.itemId === skuId)

					if (!sku) return { ...item, variationEntries: [] }

					const variationEntries = sku.variations
						?.map(variation => {
							if (typeof variation === 'object' && variation !== null) {
								return {
									key: variation.name,
									value: variation.values?.[0] ?? ''
								}
							}

							if (typeof variation === 'string') {
								return {
									key: variation,
									value: sku[variation]?.[0] ?? ''
								}
							}

							return null
						})
						.filter(Boolean)

					return {
						...item,
						variationEntries: variationEntries?.filter(v => ['Cor', 'Tamanho'].includes(v.key))
					}
				})
			)

			setCartItems(detailed)
		} catch (err) {
			console.error('ERRO loadItems', err)
		} finally {
			setIsLoading(false)
		}
	}

	const hasMessage = itemEan => {
		let message = cart.messages.filter(item => item.code === 'withoutStock' && item.fields.ean == itemEan)

		return message[0] || null
	}

	const onChangeQuantityItem = async (quantity, index) => {
		await changeQuantity(index, quantity)
	}

	const handleRemoveCartItem = async index => {
		try {
			setCartItems([...cartItems.slice(0, index), ...cartItems.slice(index + 1)])
			await removeItem(index)
		} catch (error) {
			console.error('Cart: handleRemoveCartItem Error', error)
		}
	}

	const onAddOfferingToCart = async (itemIndex, offeringId) => {
		await addItemOffer(itemIndex, offeringId)
	}

	const onRemoveOfferingFromCart = async (itemIndex, offeringId) => {
		await removeItemOffer(itemIndex, offeringId)
	}

	return (
		<View className='pb-[30px] pt-10 flex flex-col gap-1'>
			<View className='flex flex-col gap-4'>
				{cartItems?.map((item, index) => (
					<CartItem
						key={item.uniqueId}
						item={item}
						onChangeQuantityItem={newQuantity => onChangeQuantityItem(newQuantity, index)}
						message={hasMessage(item.ean)}
						handleRemoveCartItem={() => handleRemoveCartItem(index)}
						onAddOfferingToCart={offeringId => onAddOfferingToCart(index, offeringId)}
						onRemoveOfferingFromCart={offeringId => onRemoveOfferingFromCart(index, offeringId)}
					/>
				))}
			</View>

			<View className='flex justify-between items-center pb-5 pt-[22px] border-b border-[#CACACA]'>
				<Text className='text-gray-900 font-medium text-sm'>{`${cartItems?.length} ${cartItems?.length > 1 ? 'Produtos' : 'Produto'}`}</Text>

				<Text className='text-gray-900 text-sm font-semibold'>Total: {formatAmountInCents(total)}</Text>
			</View>
		</View>
	)
}
