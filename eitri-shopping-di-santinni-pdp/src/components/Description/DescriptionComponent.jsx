export default function DescriptionComponent(props) {
	const { product } = props

	const [selectedTab, setSelectedTab] = useState('')

	const buildSpecifications = product => {
		if (!product) return []

		const result = []

		let brandValue = product?.brand || product?.brandName || product?.brand_name

		if (!brandValue && Array.isArray(product?.properties)) {
			const found = product.properties.find(
				item => item?.name?.toLowerCase() === 'marca' || item?.name?.toLowerCase() === 'brand'
			)

			if (found?.values) {
				brandValue = Array.isArray(found.values) ? found.values.join(', ') : String(found.values)
			}
		}

		if (!brandValue && Array.isArray(product?.specificationGroups)) {
			product.specificationGroups.forEach(group => {
				const found = group.specifications?.find(
					s => s?.name?.toLowerCase() === 'marca' || s?.name?.toLowerCase() === 'brand'
				)

				if (found?.values) {
					brandValue = Array.isArray(found.values) ? found.values.join(', ') : String(found.values)
				}
			})
		}

		if (!brandValue && product?.specifications) {
			if (Array.isArray(product.specifications)) {
				const found = product.specifications.find(
					item => item?.name?.toLowerCase() === 'marca' || item?.name?.toLowerCase() === 'brand'
				)

				if (found?.values) {
					brandValue = Array.isArray(found.values) ? found.values.join(', ') : String(found.values)
				}
			} else if (typeof product.specifications === 'object') {
				Object.entries(product.specifications).forEach(([name, values]) => {
					if (name?.toLowerCase() === 'marca' || name?.toLowerCase() === 'brand') {
						brandValue = Array.isArray(values) ? values.join(', ') : String(values)
					}
				})
			}
		}

		if (brandValue && String(brandValue).trim()) {
			result.push({ name: 'Marca', value: String(brandValue).trim() })
		}

		return result
	}

	const specifications = buildSpecifications(product)

	const getCareContent = () => {
		if (product?.care) return product.care

		if (product?.careInstructions) return product.careInstructions

		const careSpec = specifications.find(spec => /cuidado|conserva|limpeza|higieniza|manuten/i.test(spec.name))

		return careSpec ? careSpec.value : null
	}

	const careContent = getCareContent()

	const tabs = [
		{ id: 'description', label: 'Descrição' },
		{ id: 'especifications', label: 'Especificações' }
		// { id: 'care', label: 'Cuidados' },
		//{ id: 'reviews', label: 'Avaliações' }
	]

	useEffect(() => {
		if (product?.description) {
			setSelectedTab('description')
		} else if (specifications.length > 0) {
			setSelectedTab('especifications')
		} else if (careContent) {
			setSelectedTab('care')
		}
	}, [product])

	const handleSelectTab = tabId => {
		if (selectedTab === tabId) return

		setSelectedTab(tabId)
	}

	const renderizeTabs = () => (
		<View className='w-full flex flex-col gap-3 overflow-x-auto hide-scrollbar'>
			<View className='flex flex-row gap-6 min-w-max pr-2'>
				{tabs.map(tab => {
					if (tab.id === 'description' && !product?.description) return null

					if (tab.id === 'especifications' && specifications.length === 0) return null

					const isSelected = selectedTab === tab.id

					return (
						<View
							key={tab.id}
							onClick={() => handleSelectTab(tab.id)}
							className='flex-shrink-0 w-fit flex flex-col gap-2 cursor-pointer'>
							<Text
								className={
									isSelected
										? 'text-red-700 font-semibold leading-5 tracking-[0.28px]'
										: 'text-gray-900 leading-5 tracking-[0.28px]'
								}>
								{tab.label}
							</Text>

							<View className={isSelected ? 'w-full h-[3px] bg-red-700' : 'w-full h-[3px] bg-white'} />
						</View>
					)
				})}
			</View>
		</View>
	)

	const renderizeContent = () => {
		switch (selectedTab) {
			case 'description':
				return product?.description ? (
					<HTMLRender html={product.description} />
				) : (
					<Text className='text-sm text-gray-500'>Nenhuma descrição disponível para este produto.</Text>
				)
			case 'especifications':
				return specifications.length > 0 ? (
					<View className='flex flex-col gap-3'>
						{specifications.map((spec, idx) => (
							<View
								key={`${spec.name}-${idx}`}
								className='flex flex-row justify-between border-b border-gray-100 pb-2 gap-4'>
								<Text className='font-semibold text-gray-700 text-sm min-w-[120px]'>{spec.name}</Text>
								<View className='flex-1 text-right flex justify-end'>
									<HTMLRender html={spec.value} />
								</View>
							</View>
						))}
					</View>
				) : (
					<Text className='text-sm text-gray-500'>Nenhuma especificação disponível para este produto.</Text>
				)
			case 'care':
				return careContent ? (
					<HTMLRender html={careContent} />
				) : (
					<Text className='text-sm text-gray-600 leading-relaxed'>
						Para garantir a durabilidade e boa conservação do produto, limpe-o regularmente com pano macio e
						levemente úmido. Evite o uso de produtos químicos agressivos ou lavar na máquina.
					</Text>
				)
			default:
				return null
		}
	}

	return (
		<View className='w-full mb-8'>
			{/* TODO: Esconder scrollbar no iOS quando a Eitri lançar o CSS */}
			<View className='overflow-x-auto hide-scrollbar-ios'>{renderizeTabs()}</View>
			<View className='mt-6'>
				<View className='text-sm text-gray-900 leading-5'>{renderizeContent()}</View>
			</View>
		</View>
	)
}
