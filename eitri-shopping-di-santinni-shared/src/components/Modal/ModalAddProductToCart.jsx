import { useEffect, useMemo, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { Text, View, Image } from 'eitri-luminus'
import { LuX, LuCreditCard, LuChevronUp, LuTrash } from 'react-icons/lu'
import { formatAmountInCents } from '../../utils/utils'
import CustomButton from '../CustomButton/CustomButton'
import Loading from '../Loading/LoadingComponent'
import Quantity from '../Quantity/Quantity'
import SaveButton from '../SaveButton/SaveButton'

export default function ModalAddProductToCart(props) {
	const {
		cart,
		changeItemQuantity,
		navigateCart,
		showModal,
		closeModal,
		removeItemFromCart,
		bottomInset,
		goToCheckout,
		isLoggedIn,
		safeCheckWishlistItem,
		safeAddToWishlist,
		safeRemoveItemFromWishlist
	} = props

	let checkLoginPromise = null

	const requestLogin = () => {
		return new Promise(resolve => {
			Eitri.nativeNavigation.open({
				slug: 'eitri-shopping-di-santinni-account',
				initParams: { action: 'RequestLogin' }
			})
			checkLoginPromise = null
			Eitri.navigation.setOnResumeListener(resolve)
		})
	}

	const ensureLoggedIn = async () => {
		if (isLoggedIn) return true

		await requestLogin()

		return isLoggedIn()
	}

	const getItemKey = item => item?.uniqueId || `${item?.id}-${item?.itemIndex ?? item?.skuId ?? ''}`

	const normalizedCart = useMemo(() => {
		if (!cart) return null

		return cart
	}, [cart])

	const [maxInstallments, setMaxInstallments] = useState(0)
	const [localQuantities, setLocalQuantities] = useState({})
	const [wishlistItems, setWishlistItems] = useState({})
	const [loadingWishlist, setLoadingWishlist] = useState({})
	const [prevShowModal, setPrevShowModal] = useState(false)
	const [isLoadingDelete, setIsLoadingDelete] = useState(false)
	const [isTotalOpen, setIsTotalOpen] = useState(true)

	const [mounted, setMounted] = useState(false)
	const [visible, setVisible] = useState(false)
	const TRANSITION_MS = 300

	useEffect(() => {
		if (showModal) {
			setMounted(true)
			setTimeout(() => setVisible(true), 50)
		} else if (mounted) {
			setVisible(false)
			const t = setTimeout(() => setMounted(false), TRANSITION_MS)

			return () => clearTimeout(t)
		}
	}, [showModal, mounted])

	useEffect(() => {
		if (showModal) {
			document.body.style.overflow = 'hidden'
			document.documentElement.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
			document.documentElement.style.overflow = ''
		}

		return () => {
			document.body.style.overflow = ''
			document.documentElement.style.overflow = ''
		}
	}, [showModal])

	const internalClose = () => {
		setVisible(false)
		setTimeout(() => closeModal && closeModal(), TRANSITION_MS)
	}

	const getItemId = item => item?.id || item?.productId || item?.uniqueId

	const handleTouchTotal = () => {
		setIsTotalOpen(!isTotalOpen)
	}

	useEffect(() => {
		if (!normalizedCart?.paymentData?.installmentOptions) {
			setMaxInstallments(0)

			return
		}

		let max = 0

		normalizedCart.paymentData.installmentOptions.forEach(option => {
			option.installments.forEach(installment => {
				if (installment.count > max) {
					max = installment.count
				}
			})
		})
		setMaxInstallments(max)
	}, [normalizedCart])

	useEffect(() => {
		if (!normalizedCart?.items?.length) return

		if (!prevShowModal && showModal && Object.keys(localQuantities).length === 0) {
			const seeded = normalizedCart.items.reduce((acc, item, idx) => {
				const idxKey = item.itemIndex ?? idx

				acc[idxKey] = item.quantity

				return acc
			}, {})

			setLocalQuantities(seeded)

			normalizedCart.items.forEach(item => {
				checkWishlist(item)
			})
		} else if (prevShowModal && showModal) {
			setLocalQuantities(prev => {
				const updated = { ...prev }

				normalizedCart.items.forEach((item, idx) => {
					const idxKey = item.itemIndex ?? idx

					if (!(idxKey in prev)) {
						updated[idxKey] = item.quantity
					}
				})

				return updated
			})
		}

		setPrevShowModal(showModal)

		if (prevShowModal && !showModal) {
			setLocalQuantities({})
		}
	}, [showModal, normalizedCart])

	useEffect(() => {
		if (!bottomInset) return

		if (showModal) {
			Eitri.bottomBar.hide()
		} else {
			Eitri.bottomBar.show()
		}
	}, [showModal, bottomInset])

	const handleChangeQuantity = (item, itemIndex, delta) => {
		const currentQuantity = localQuantities[itemIndex] ?? item.quantity
		const newQuantity = currentQuantity + delta

		if (newQuantity < 1) {
			handleRemoveItem(item, itemIndex)

			return
		}

		setLocalQuantities(prev => ({
			...prev,
			[itemIndex]: newQuantity
		}))

		if (typeof changeItemQuantity === 'function') {
			changeItemQuantity(itemIndex, newQuantity)
		}
	}

	const handleRemoveItem = async (item, itemIndex) => {
		if (typeof removeItemFromCart === 'function') {
			setIsLoadingDelete({
				item,
				loading: true
			})
			await removeItemFromCart(itemIndex)
		}
	}

	const handleSaveFavorite = async item => {
		const itemId = getItemId(item)

		try {
			setLoadingWishlist(prev => ({ ...prev, [itemId]: true }))
			const currentWishlistId = wishlistItems[itemId]

			if (currentWishlistId) {
				if (safeRemoveItemFromWishlist) {
					await safeRemoveItemFromWishlist(currentWishlistId)
				}

				setWishlistItems(prev => {
					const newState = { ...prev }

					delete newState[itemId]

					return newState
				})
			} else {
				if (safeAddToWishlist) {
					const result = await safeAddToWishlist(item, item.name, item.id)
					const addedId = result?.data?.addToList || result?.addToList

					setWishlistItems(prev => ({
						...prev,
						[itemId]: addedId
					}))
				}
			}
		} catch (e) {
			console.error('Erro ao salvar favorito:', e)
		} finally {
			setLoadingWishlist(prev => ({ ...prev, [itemId]: false }))
		}
	}

	const checkWishlist = async item => {
		try {
			if (!safeCheckWishlistItem) return

			const itemId = getItemId(item)
			const { inList, listId } = await safeCheckWishlistItem(item.productId || item.id)

			if (inList) {
				setWishlistItems(prev => ({
					...prev,
					[itemId]: listId
				}))
			}
		} catch (e) {
			console.error('Erro ao verificar wishlist:', e)
		}
	}

	const {
		itemsTotalizer,
		discountsTotalizer,
		shippingTotalizer,
		cartTotal,
		calculatedDiscount,
		formattedSubtotal,
		formattedDiscounts,
		formattedShipping
	} = useMemo(() => {
		if (!normalizedCart?.totalizers) {
			const sum = normalizedCart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0

			return {
				itemsTotalizer: null,
				discountsTotalizer: null,
				shippingTotalizer: null,
				cartTotal: normalizedCart?.value || 0,
				calculatedDiscount: 0,
				formattedSubtotal: formatAmountInCents(sum),
				formattedDiscounts: '',
				formattedShipping: formatAmountInCents(0)
			}
		}

		const itemsTotalizer = normalizedCart.totalizers.find(t => t.id === 'Items')
		const discountsTotalizer = normalizedCart.totalizers.find(t => t.id === 'Discounts')
		const shippingTotalizer = normalizedCart.totalizers.find(t => t.id === 'Shipping')
		const cartTotal = normalizedCart.value

		let calculatedDiscount = 0

		if (discountsTotalizer) {
			calculatedDiscount = discountsTotalizer.value
		}

		const subtotalVal = itemsTotalizer
			? itemsTotalizer.value
			: normalizedCart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0

		const formattedSubtotal = formatAmountInCents(subtotalVal)

		let formattedDiscounts = ''

		if (discountsTotalizer && discountsTotalizer.value !== 0) {
			formattedDiscounts = formatAmountInCents(Math.abs(discountsTotalizer.value))
		}

		const shippingVal = shippingTotalizer ? shippingTotalizer.value : 0
		const formattedShipping = formatAmountInCents(shippingVal)

		return {
			itemsTotalizer,
			discountsTotalizer,
			shippingTotalizer,
			cartTotal,
			calculatedDiscount,
			formattedSubtotal,
			formattedDiscounts,
			formattedShipping
		}
	}, [normalizedCart])

	const getInstallmentInfo = () => {
		const options = normalizedCart?.paymentData?.installmentOptions

		if (!options) return null

		let bestInstallment = null

		options.forEach(option => {
			option.installments.forEach(installment => {
				if (!bestInstallment) {
					bestInstallment = installment

					return
				}

				const currentIsNoInterest = bestInstallment.hasInterestRate === false
				const candidateIsNoInterest = installment.hasInterestRate === false

				if (candidateIsNoInterest && !currentIsNoInterest) {
					bestInstallment = installment

					return
				}

				if (
					installment.count > bestInstallment.count &&
					installment.hasInterestRate === bestInstallment.hasInterestRate
				) {
					bestInstallment = installment
				}
			})
		})

		return bestInstallment
	}

	const installment = getInstallmentInfo()

	if (!mounted) return null

	return (
		<View
			className={`fixed inset-0 z-[99999] flex items-end justify-center overflow-hidden bg-black transition-opacity duration-300 ease-out ${visible ? 'bg-opacity-50' : 'bg-opacity-0'}`}>
			<View
				onClick={internalClose}
				className='absolute inset-0'
			/>
			<View
				className={`relative flex flex-col bg-white rounded-t-xl max-h-[90vh] w-full overflow-hidden transition-transform duration-300 ease-out ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
				<View className='flex justify-between items-center w-full px-5 pt-6 pb-2'>
					<Text className='text-2xl font-bold text-black'>Carrinho</Text>
					<View
						onClick={internalClose}
						className='p-1'>
						<LuX
							size={24}
							color='#000'
						/>
					</View>
				</View>

				{maxInstallments > 1 && (
					<View className='flex flex-row items-center gap-2 py-2 justify-center bg-green-100 mb-2'>
						<LuCreditCard
							size={20}
							color='#15803d'
						/>
						<Text className='text-base text-green-800 font-medium'>
							{`Parcelamento em até ${maxInstallments}x s/ juros`}
						</Text>
					</View>
				)}

				<View className='flex-1 overflow-auto gap-3'>
					<View className='flex flex-col gap-1 bg-white'>
						{normalizedCart?.items?.length ? (
							normalizedCart.items.map((item, mapIndex) => {
								const itemIndex = mapIndex

								if (isLoadingDelete.loading && isLoadingDelete.item === item) {
									return (
										<View
											key={getItemKey(item)}
											className='py-4'>
											<Loading />
										</View>
									)
								}

								const resizedImageUrl = item.imageUrl
									? item.imageUrl.replace(/\/(\d+)-\d+-\d+\//, '/$1-200-200/')
									: ''
								const { size, color } = (() => {
									const raw = (item.name || '').trim()

									if (!raw) return { size: '', color: '' }

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
										const secondLastPart =
											nameParts.length > 1 ? nameParts[nameParts.length - 2] : null
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

									return { size: detectedSize, color: detectedColor }
								})()

								return (
									<View
										key={getItemKey(item)}
										className='flex flex-row items-center p-3 bg-neutral-50 gap-3 border-b border-neutral-200'>
										<View className='flex items-center justify-center w-20 h-20'>
											<Image
												src={resizedImageUrl}
												className='w-full h-full object-contain'
											/>
										</View>
										<View className='flex-1 flex flex-col w-full gap-2'>
											<Text className='text-sm pr-2 text-neutral-900'>{item.name}</Text>

											<View className='flex flex-col gap-1'>
												{size && (
													<Text className='text-sm'>
														Tamanho:
														<Text className='text-gray-500 font-light'> {size}</Text>
													</Text>
												)}
												{color && (
													<Text className='text-sm'>
														Cor:<Text className='text-gray-500 font-light'> {color}</Text>
													</Text>
												)}
											</View>

											<View className='flex items-center gap-2 my-2'>
												<Text className='text-xs font-medium'>
													{item.formattedPrice || formatAmountInCents(item.price)}
												</Text>
												{item?.listPrice && item.price !== item.listPrice && (
													<Text className='line-through font-light text-gray-500 text-sm'>
														{formatAmountInCents(item.listPrice)}
													</Text>
												)}
											</View>

											<View className='flex flex-row items-center justify-between gap-3'>
												<Quantity
													quantity={localQuantities[itemIndex] ?? item.quantity}
													handleItemQuantity={delta =>
														handleChangeQuantity(item, itemIndex, delta)
													}
													disable={false}
												/>
												{loadingWishlist[getItemId(item)] ? (
													<Loading width={'80px'} />
												) : safeAddToWishlist ? (
													<SaveButton
														handleSaveFavorite={() => handleSaveFavorite(item)}
														isInWishlist={!!wishlistItems[getItemId(item)]}
														disabled={loadingWishlist[getItemId(item)]}
													/>
												) : null}
											</View>
										</View>
										<View
											onClick={() => handleRemoveItem(item, itemIndex)}
											className='flex items-start bg-transparent pt-2 pl-2'>
											<LuTrash
												size={18}
												color='#525252'
											/>
										</View>
									</View>
								)
							})
						) : (
							<View className='p-4'>
								<Text className='font-medium text-neutral-600'>Seu carrinho está vazio.</Text>
							</View>
						)}
					</View>
				</View>

				<View className='flex flex-col gap-2 px-5 pb-[100px] bg-white pt-2 shadow-t'>
					<View
						onClick={handleTouchTotal}
						className='flex justify-center items-center py-2'>
						<View
							className={`transition-transform duration-300 ${isTotalOpen ? 'rotate-180' : 'rotate-0'}`}>
							<LuChevronUp
								size={20}
								color='#525252'
							/>
						</View>
					</View>

					<View
						className={`overflow-hidden transition-all duration-300 ${isTotalOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
						<View className='flex flex-col mb-2 gap-1'>
							<View className='flex flex-row justify-between'>
								<Text className='text-neutral-600'>Subtotal</Text>
								<Text className='text-neutral-900 font-medium'>{formattedSubtotal}</Text>
							</View>
							{discountsTotalizer && discountsTotalizer.value !== 0 && (
								<View className='flex flex-row justify-between'>
									<Text className='text-neutral-600'>Descontos</Text>
									<Text className='text-green-600 font-medium'>- {formattedDiscounts}</Text>
								</View>
							)}
							<View className='flex flex-row justify-between'>
								<Text className='text-neutral-600'>Frete</Text>
								<Text className='text-neutral-900 font-medium'>{formattedShipping}</Text>
							</View>
						</View>
					</View>

					<View className='flex flex-row justify-between items-center mb-1'>
						<Text className='text-lg font-bold text-neutral-900'>Total</Text>
						<Text className='text-lg font-bold text-neutral-900'>{formatAmountInCents(cartTotal)}</Text>
					</View>
					{installment && (
						<View className='flex flex-row justify-end mb-3'>
							<Text className='text-xs text-neutral-600'>
								{`${installment.count}x de ${formatAmountInCents(installment.value)}`}
							</Text>
						</View>
					)}

					<CustomButton
						label={'Finalizar Compra'}
						onPress={() => {
							internalClose()

							if (typeof goToCheckout === 'function') {
								goToCheckout()
							} else if (typeof navigateCart === 'function') {
								navigateCart()
							}
						}}
						className='bg-primary text-white w-full py-3 mb-2 rounded font-bold'
					/>
					<CustomButton
						onPress={internalClose}
						className='bg-white w-full py-3 border border-primary rounded font-bold'>
						<Text className='font-bold text-red-700'>Continuar comprando</Text>
					</CustomButton>
				</View>
			</View>
		</View>
	)
}
