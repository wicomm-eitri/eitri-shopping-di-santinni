import Loading from '../Loading/LoadingComponent'

export default function CustomButton(props) {
	const {
		disabled,
		color,
		backgroundColor,
		variant,
		label,
		onPress,
		onClick,
		isLoading,
		width,
		borderRadius,
		className,
		outlined,
		children,
		leftIcon,
		...rest
	} = props

	const _onPress = () => {
		if (!disabled && onPress && typeof onPress === 'function') {
			onPress()
		}

		if (!disabled && onClick && typeof onClick === 'function') {
			onClick()
		}
	}

	const _backgroundColor = (() => {
		if (variant === 'outlined' || outlined) {
			return 'transparent'
		}

		return isLoading || disabled ? 'bg-gray-300' : 'bg-red-700'
	})()

	const _contentColor = (() => {
		if (variant === 'outlined' || outlined) {
			return 'text-primary'
		}

		return isLoading || disabled ? 'text-gray-500' : 'text-white'
	})()

	const renderContent = () => {
		// Adicionamos uppercase e tracking-wide para o texto ficar igual ao Figma
		if (leftIcon) {
			return (
				<View className='flex items-center gap-2'>
					<View className={_contentColor}>{leftIcon}</View>
					<Text className={`font-bold uppercase tracking-wide text-[14px] ${_contentColor}`}>{label}</Text>
				</View>
			)
		}

		return <Text className={`font-bold uppercase tracking-wide text-[14px] ${_contentColor}`}>{label}</Text>
	}

	return (
		<View
			onClick={_onPress}
			className={`
                flex items-center justify-center 
                h-[48px]
                rounded-full
                w-full
                cursor-pointer
                transition-opacity active:opacity-80
                ${_backgroundColor ? `${_backgroundColor}` : ''}
                ${variant === 'outlined' || outlined ? `border-[1.5px] border-primary` : ''}
                ${className || ''}
            `}
			{...rest}>
			{children || (isLoading ? <Loading /> : renderContent())}
		</View>
	)
}
