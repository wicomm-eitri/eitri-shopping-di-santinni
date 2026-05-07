import Eitri from 'eitri-bifrost'

export default function HeaderCart(props) {
	const { quantityOfItems, onClick, cart } = props

	const [_quantityOfItems, setQuantityOfItems] = useState(quantityOfItems ?? 0)

	useEffect(() => {
		if (cart) {
			const itemsQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0)

			setQuantityOfItems(itemsQuantity)
		}
	}, [cart])

	const handlePress = () => {
		if (onClick) {
			onClick()

			return
		} else {
			Eitri.nativeNavigation.open({
				slug: 'cart'
			})
		}
	}

	return (
		<View className={`relative w-[20px] h-[20px] flex items-center`}>
			<View onClick={handlePress}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='20'
					height='20'
					viewBox='0 0 20 20'
					stroke='currentColor'
					fill='none'>
					<path
						d='M2.5 7.49992C2.5 7.05789 2.67559 6.63397 2.98816 6.32141C3.30072 6.00885 3.72464 5.83325 4.16667 5.83325H15.8333C16.2754 5.83325 16.6993 6.00885 17.0118 6.32141C17.3244 6.63397 17.5 7.05789 17.5 7.49992V16.6666C17.5 17.1086 17.3244 17.5325 17.0118 17.8451C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8451C2.67559 17.5325 2.5 17.1086 2.5 16.6666V7.49992Z'
						stroke='#888888'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
					<path
						d='M6.66663 8.33341V5.00008C6.66663 4.11603 7.01782 3.26818 7.64294 2.64306C8.26806 2.01794 9.1159 1.66675 9.99996 1.66675C10.884 1.66675 11.7319 2.01794 12.357 2.64306C12.9821 3.26818 13.3333 4.11603 13.3333 5.00008V8.07425'
						stroke='#888888'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</View>

			{_quantityOfItems > 0 && (
				<View
					className={`absolute top-[-10px] right-[-10px] flex rounded-full w-5 h-5 justify-center items-center bg-header-content`}>
					<Text className='text-[12px] font-bold text-header-background'>{_quantityOfItems}</Text>
				</View>
			)}
		</View>
	)
}
