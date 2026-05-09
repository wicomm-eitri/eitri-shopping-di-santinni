export default function LoadingComponent(props) {
	const { isLoading, fullScreen, className = '' } = props

	if (typeof isLoading === 'boolean' && !isLoading) return null

	if (fullScreen) {
		return (
			<View className='fixed inset-0 z-[999] bg-neutral-500 opacity-90 flex justify-center items-center'>
				<Loading className={`loading-lg ${className}`} />
			</View>
		)
	}

	return (
		<View>
			<Loading className={`${className}`} />
		</View>
	)
}
