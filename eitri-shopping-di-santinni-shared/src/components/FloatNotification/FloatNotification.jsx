export default function FloatNotification(props) {
	const {
		showNotification = false,
		status = 'neutral',
		functionExitNotification,
		title = '',
		subTitle,
		showIcon = false,
		icon = 'x',
		iconFunction = () => {},
		label = 'desfazer',
		onCloseNotification = () => {},
		childrenHtml,
		duration = 3500,
		bgColor = 'bg-success',
		toast = false,
		...rest
	} = props

	const [notificationTimeout, setNotificationTimeout] = useState(null)
	const [id] = useState(`element_notification_${new Date().getTime()}`)
	const [idItem] = useState(`element_notification_Item_${new Date().getTime()}`)
	const [translate, setTranslate] = useState('translate-y-[280%]')
	const [translateItem, setTranslateItem] = useState('translateY(0)')
	const [initialY, setInitialY] = useState(0)

	const onClose = () => {
		clearTimeout(notificationTimeout)
		setTranslate('translate-y-[280%]')
		setTimeout(() => {
			onCloseNotification()
			functionExitNotification(false)
		}, 800)
	}

	const handleTouchStart = event => {
		const touch = event.touches[0]

		setInitialY(touch.clientY)
	}

	const handleTouchMove = event => {
		const touch = event.changedTouches[0]
		const moveY = initialY - touch.clientY

		setTranslateItem(`translateY(-${moveY}px)`)
	}

	const handleTouchEnd = event => {
		const touch = event.changedTouches[0]
		const moveY = initialY - touch.clientY

		if (moveY > 50) {
			onClose()
		} else {
			setTranslateItem('translateY(0)')
		}
	}

	useEffect(() => {
		const element = window.document.querySelector(`#${id}`)

		if (element) {
			element.addEventListener('touchstart', handleTouchStart)
			element.addEventListener('touchmove', handleTouchMove)
			element.addEventListener('touchend', handleTouchEnd)
		}

		return () => {
			if (element) {
				element.removeEventListener('touchstart', handleTouchStart)
				element.removeEventListener('touchmove', handleTouchMove)
				element.removeEventListener('touchend', handleTouchEnd)
			}
		}
	})

	useEffect(() => {
		if (showNotification) {
			setTranslate('-translate-y-[200%]')

			let teste = setTimeout(() => {
				setTranslate('translate-y-[280%]')
				setTimeout(() => {
					onCloseNotification()
					functionExitNotification(false)
				}, 800)
			}, duration)

			setNotificationTimeout(teste)
		} else {
			clearTimeout(notificationTimeout)
			setTranslate('translate-y-[280%]')
			setTranslateItem('translateY(0)')
			setInitialY(0)
		}
	}, [showNotification])

	if (toast) {
		return (
			showNotification && (
				<View
					className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-[99999] shadow-lg transition-transform duration-800 ease-in-out rounded px-3 py-2 ${translate} ${bgColor}`}>
					<Text className='text-base-100 font-semibold text-center text-sm'>{title}</Text>
				</View>
			)
		)
	}

	return (
		showNotification && (
			<View
				{...rest}
				id={id}
				className={`fixed bottom-[10%] left-[10%] w-full max-w-[80%] z-[99999] shadow-lg transition-transform duration-800 ease-in-out rounded-sm px-4 ${translate} ${bgColor}`}>
				<View
					id={idItem}
					transform={translateItem}
					className={`flex ${
						childrenHtml ? 'h-auto py-2' : 'h-14'
					} w-auto items-center justify-between gap-2`}>
					<View className='flex max-w-[90%] flex-col gap-1'>
						<Text className='overflow-hidden text-center text-ellipsis whitespace-nowrap font-bold text-base-100 text-sm'>
							{title}
						</Text>

						{childrenHtml ? (
							<HTMLRender
								html={childrenHtml}
								className=''
							/>
						) : subTitle ? (
							<Text className='overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-light text-base-100'>
								{subTitle}
							</Text>
						) : null}
					</View>
				</View>
			</View>
		)
	)
}
