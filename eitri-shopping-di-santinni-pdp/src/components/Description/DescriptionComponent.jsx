export default function DescriptionComponent(props) {
	const { product } = props

	const [selectedTab, setSelectedTab] = useState('')

	const tabs = [
		{ id: 'description', label: 'Descrição' },
		{ id: 'especifications', label: 'Especificações' },
		{ id: 'care', label: 'Cuidados' },
		{ id: 'reviews', label: 'Avaliações' }
	]

	useEffect(() => {
		if (product?.description) {
			setSelectedTab('description')
		}
	}, [product])

	const handleSelectTab = tabId => {
		if (selectedTab === tabId) return

		setSelectedTab(tabId)
	}

	const renderizeTabs = () => {
		return tabs.map(tab => {
			if (tab.id === 'description' && !product?.description) return null
			// TODO: add conditions for other tabs when their content is ready (e.g. only show "Avaliações" if there are reviews)

			return (
				<View
					key={tab.id}
					onClick={() => handleSelectTab(tab.id)}
					className='w-fit'>
					<Text className={selectedTab === tab.id ? 'text-red-700 font-semibold' : 'text-gray-900' + ` leading-5 tracking-[0.28px]`}>{tab.label}</Text>
					{selectedTab === tab.id && <View className='w-full h-[3px] rounded-full bg-red-700 mt-3' />}
				</View>
			)
		})
	}

	const renderizeContent = () => {
		switch (selectedTab) {
			case 'description':
				return product?.description
			case 'especifications':
				return 'Especificações do produto'
			case 'care':
				return 'Cuidados com o produto'
			case 'reviews':
				return 'Avaliações do produto'
			default:
				return null
		}
	}

	return (
		<View className='w-full mb-8'>
			<View className='flex space-x-6 overflow-x-auto'>{renderizeTabs()}</View>
			<View className='mt-8'>
				<Text className='text-sm text-gray-900 leading-5'>{renderizeContent()}</Text>
			</View>
		</View>
	)
}
