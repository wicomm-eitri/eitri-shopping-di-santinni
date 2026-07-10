const LOREM_IPSUM =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec suscipit auctor dui, sed efficitur enim efficitur a. Donec eget ligula ac nisl efficitur efficitur. Donec suscipit auctor dui, sed efficitur enim efficitur a. Donec eget ligula ac nisl efficitur efficitur.'

export default function DescriptionComponent(props) {
	const { product } = props

	const [selectedTab, setSelectedTab] = useState('')

	const tabs = [
		{ id: 'description', label: 'Descrição' },
		{ id: 'especifications', label: 'Especificações' },
		{ id: 'care', label: 'Cuidados' },
		//{ id: 'reviews', label: 'Avaliações' }
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

	const renderizeTabs = () => (
		<View className='w-full flex flex-col gap-3 overflow-x-auto'>
			<View className='flex flex-row gap-6 min-w-max pr-2'>
				{tabs.map(tab => {
					if (tab.id === 'description' && !product?.description) return null

					const isSelected = selectedTab === tab.id

					return (
						<View
							key={tab.id}
							onClick={() => handleSelectTab(tab.id)}
							className='flex-shrink-0 w-fit flex flex-col gap-2'>
							<Text
								className={
									isSelected
										? 'text-red-700 font-semibold leading-5 tracking-[0.28px]'
										: 'text-gray-900 leading-5 tracking-[0.28px]'
								}>
								{tab.label}
							</Text>

							<View
								className={isSelected ? 'w-full h-[3px] bg-red-700' : 'w-full h-[3px] bg-white'}
							/>
						</View>
					)
				})}
			</View>
		</View>
	)

	const renderizeContent = () => {
		switch (selectedTab) {
			case 'description':
				return product?.description
			case 'especifications':
				return 'Especificações do produto - ' + LOREM_IPSUM
			case 'care':
				return 'Cuidados com o produto - ' + LOREM_IPSUM
			case 'reviews':
				return 'Avaliações do produto - ' + LOREM_IPSUM
			case 'questions':
				return 'Perguntas sobre o produto - ' + LOREM_IPSUM
			case 'warranty':
				return 'Garantia do produto - ' + LOREM_IPSUM
			case 'manual':
				return 'Manual do produto - ' + LOREM_IPSUM
			default:
				return null
		}
	}

	return (
		<View className='w-full mb-8'>
			{/* TODO: Esconder scrollbar no iOS quando a Eitri lançar o CSS */}
			<View className='overflow-x-auto hide-scrollbar-ios'>{renderizeTabs()}</View>
			<View className='mt-8'>
				<Text className='text-sm text-gray-900 leading-5'>{renderizeContent()}</Text>
			</View>
		</View>
	)
}
