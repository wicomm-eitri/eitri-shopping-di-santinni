import Eitri from 'eitri-bifrost'
import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText } from 'eitri-shopping-di-santinni-shared'
import { getStores } from '../services/StoreService'
import DuvidasFrequentesImage from '../assets/images/Duvidas_frequentes.png'

const calculateDistance = (lat1, lon1, lat2, lon2) => {
	if (!lat1 || !lon1 || !lat2 || !lon2) return null

	const R = 6371
	const dLat = (lat2 - lat1) * (Math.PI / 180)
	const dLon = (lon2 - lon1) * (Math.PI / 180)
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

	return R * c
}

export default function NossasLojas() {
	const [stores, setStores] = useState([])
	const [query, setQuery] = useState('')
	const [filtered, setFiltered] = useState([])
	const [suggestions, setSuggestions] = useState([])
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [selectedLocation, setSelectedLocation] = useState(null)
	const [stateAvailable, setStateAvailable] = useState([])
	const [stateSelected, setStateSelected] = useState({ sigla: '' })
	const [cities, setCities] = useState([])
	const [citySelected, setCitySelected] = useState('')
	const [stateOpen, setStateOpen] = useState(false)
	const [cityOpen, setCityOpen] = useState(false)
	const [userLocation, setUserLocation] = useState(null)
	const [isSearchingLocation, setIsSearchingLocation] = useState(false)

	useEffect(() => {
		const geocode = async () => {
			if (!query || query.length < 5) {
				setUserLocation(null)

				return
			}

			setIsSearchingLocation(true)

			try {
				let nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br`
				
				const isCep = /^\d{5}-?\d{3}$/.test(query)
				
				if (isCep) {
					// Fetch from ViaCEP first
					const cleanCep = query.replace(/\D/g, '')
					const viaCepRes = await Eitri.http.get(`https://viacep.com.br/ws/${cleanCep}/json/`)
					
					if (viaCepRes.data && !viaCepRes.data.erro) {
						const { logradouro, localidade, uf } = viaCepRes.data
						// If ViaCEP found it, we use street and city for Nominatim
						const streetPart = logradouro ? `&street=${encodeURIComponent(logradouro)}` : ''

						nominatimUrl += `${streetPart}&city=${encodeURIComponent(localidade)}&state=${encodeURIComponent(uf)}`
					} else {
						// Fallback if ViaCEP fails, just pass postalcode and hope for the best
						nominatimUrl += `&postalcode=${query}`
					}
				} else {
					nominatimUrl += `&q=${encodeURIComponent(query)}`
				}

				const res = await Eitri.http.get(nominatimUrl, {
					headers: { 'User-Agent': 'EitriApp-DiSantinni/1.0 (dev@wicomm.com)' }
				})
				
				if (res.data && res.data.length > 0) {
					setUserLocation({ lat: parseFloat(res.data[0].lat), lon: parseFloat(res.data[0].lon) })
				} else {
					setUserLocation(null)
				}
			} catch (e) {
				console.error('Erro ao buscar localização', e)
				setUserLocation(null)
			} finally {
				setIsSearchingLocation(false)
			}
		}

		const timeoutId = setTimeout(geocode, 1000)

		return () => clearTimeout(timeoutId)
	}, [query])

	useEffect(() => {
		const load = async () => {
			const stores = await getStores()

			setStores(stores || [])

			const getStateFrom = item =>
				item?.state || item?.address?.state || item?.uf || item?.region || item?.stateCode || ''

			const states = Array.from(new Set((stores || []).map(x => getStateFrom(x)).filter(Boolean)))
				.sort((a, b) => a.localeCompare(b, { sensitivity: 'base' }))
				.map(sigla => ({
					sigla,
					nome: sigla
				}))

			setStateAvailable(states)
		}

		load()
	}, [])

	useEffect(() => {
		const getCityFrom = item =>
			item?.city || item?.address?.city || item?.localidade || item?.town || item?.municipio || ''
		const getStateFrom = item =>
			item?.state || item?.address?.state || item?.uf || item?.region || item?.stateCode || ''

		if (stateSelected?.sigla) {
			const cs = Array.from(
				new Set(
					(stores || [])
						.filter(st => getStateFrom(st) === stateSelected.sigla)
						.map(st => getCityFrom(st))
						.filter(Boolean)
				)
			).sort((a, b) => a.localeCompare(b, { sensitivity: 'base' }))

			setCities(cs)
			setCitySelected('')
		} else {
			setCities([])
			setCitySelected('')
		}
	}, [stateSelected, stores])

	useEffect(() => {
		const q = (query || '').trim().toLowerCase()

		if (!q) {
			setSuggestions([])
			setShowSuggestions(false)

			if (!selectedLocation) setFiltered(stores)

			return
		}

		const uniq = {}
		const candidates = (stores || [])
			.map(s => {
				const cep = s.cep || s.zip || s.zipcode || s.postalCode || ''
				const city = s.city || ''

				return { city: city, cep: cep }
			})
			.filter(x => x.city || x.cep)

		for (const c of candidates) {
			const key = `${c.city}|${c.cep}`

			if (!uniq[key]) {
				const hay = `${c.city} ${c.cep}`.toLowerCase()

				if (hay.indexOf(q) !== -1) {
					uniq[key] = c
				}
			}
		}

		const list = Object.values(uniq)

		setSuggestions(list)
		setShowSuggestions(list.length > 0)

		const result = (stores || []).filter(s => {
			const hay = `${s.name || ''} ${s.address || ''} ${s.city || ''} ${s.state || ''}`.toLowerCase()

			return hay.indexOf(q) !== -1
		})

		if (!selectedLocation) setFiltered(result)
	}, [stores, query, selectedLocation])

	useEffect(() => {
		let result = stores || []

		if (stateSelected && stateSelected.sigla) {
			result = result.filter(s => s.state === stateSelected.sigla)
		}

		if (citySelected) {
			result = result.filter(s => s.city === citySelected)
		}

		const q = (query || '').trim().toLowerCase()

		if (q && !userLocation) {
			result = result.filter(s => {
				const hay = `${s.name || ''} ${s.address || ''} ${s.city || ''} ${s.state || ''}`.toLowerCase()

				return hay.indexOf(q) !== -1
			})
		}

		if (userLocation) {
			result = result.map(s => {
				const dist = calculateDistance(userLocation.lat, userLocation.lon, parseFloat(s.lat), parseFloat(s.lng))

				return { ...s, distance: dist }
			})
			result.sort((a, b) => {
				if (a.distance === null) return 1

				if (b.distance === null) return -1

				return a.distance - b.distance
			})
		} else {
			result = result.map(s => ({ ...s, distance: null }))
		}

		setFiltered(result)
	}, [stores, stateSelected, citySelected, query, userLocation])

	const splitLabelAndValue = text => {
		if (!text) return { label: '', value: '' }

		const [label, ...rest] = String(text).split(':')

		if (!rest.length) {
			return { label: '', value: text }
		}

		return {
			label: `${label.trim()}:`,
			value: rest.join(':').trim()
		}
	}

	return (
		<Page
			bottomInset
			className='bg-[#f8f8f8] text-gray-900'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text='Nossas lojas' />
			</HeaderContentWrapper>

			{/* Background Image Area */}
			<View className='w-full h-72'>
				<Image
					src={DuvidasFrequentesImage}
					className='w-full h-full object-cover'
				/>
			</View>

			{/* Main Card (Overlaps the image) */}
			<View className='bg-[#f8f8f8] rounded-t-[32px] -mt-6'>
				<View className='p-6 bg-white rounded-[32px] m-4 mt-0 shadow-sm relative -top-12'>
					<Text className='text-[#C8102E] font-bold text-lg mb-4 uppercase tracking-wide'>
						Encontre Nossas Lojas
					</Text>

					<View className='mb-4 mt-4'>
						<View className='relative'>
							<View
								onClick={() => {
									setStateOpen(!stateOpen)
									setCityOpen(false)
								}}
								className='w-full p-4 border border-neutral-300 rounded-lg flex text-neutral-500 justify-between items-center'>
								<Text className='text-[13px]'>{stateSelected?.sigla || 'Estado'}</Text>
								<Text className='text-neutral-500 text-[10px]'>▼</Text>
							</View>

							{stateOpen && (
								<View className='absolute left-0 right-0 mt-1 bg-white border border-gray-200 text-gray-900 rounded-lg shadow-md z-50 overflow-auto max-h-[50vh]'>
									<View
										onClick={() => {
											setStateSelected({ sigla: '' })
											setStateOpen(false)
										}}
										className='p-3 border-b border-gray-200'>
										<Text>Todos</Text>
									</View>
									{stateAvailable?.map(state => (
										<View
											key={state.sigla}
											onClick={() => {
												setStateSelected(state)
												setStateOpen(false)
											}}
											className='p-3 border-b border-gray-200'>
											<Text>{state.nome}</Text>
										</View>
									))}
								</View>
							)}
						</View>

						<View className='mt-4 relative'>
							<TextInput
								value={query}
								onChange={e => setQuery(e.target.value)}
								placeholder='Procurar por Estado ou CEP'
								className='w-full text-neutral-500 text-[13px] p-4 border border-neutral-300 rounded-lg pr-10'
							/>
							<View className='absolute right-4 top-4'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='16'
									height='16'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-neutral-500'>
									<circle
										cx='11'
										cy='11'
										r='8'></circle>
									<line
										x1='21'
										y1='21'
										x2='16.65'
										y2='16.65'></line>
								</svg>
							</View>
						</View>
						{isSearchingLocation && (
							<Text className='text-xs text-gray-500 mt-2'>Buscando localização...</Text>
						)}
					</View>
				</View>

				{/* Store Cards */}
				<View className='px-6 pb-6 -mt-8'>
					{(filtered || stores || []).length === 0 ? (
						<Text className='text-gray-500 p-4'>Nenhuma loja encontrada.</Text>
					) : (
						(filtered.length ? filtered : stores).map((store, idx) => {
							const phone = splitLabelAndValue(store.phone)

							return (
								<View
									key={idx}
									className='flex flex-col mb-8'>
									<Text className='text-[15px] font-bold text-black mb-5 tracking-tight'>
										{store.name}
									</Text>

									{store.city && store.state && (
										<Text className='text-[11px] font-medium text-black mb-3 uppercase tracking-wide'>
											{store.city}/{store.state}
										</Text>
									)}

									{store.distance !== null && store.distance !== undefined && (
										<Text className='text-xs text-[#C8102E] font-bold mb-2'>
											A {store.distance.toFixed(1)} km de você
										</Text>
									)}

									{phone.value ? (
										<Text className='text-[11px] font-medium text-black mb-3'>{phone.value}</Text>
									) : store.phone ? (
										<Text className='text-[11px] font-medium text-black mb-3'>{store.phone}</Text>
									) : null}

									<Text className='text-[11px] font-medium text-black mb-5'>
										Entre em contato com a loja
									</Text>

									<View
										className='bg-[#C8102E] rounded-[30px] py-[14px] items-center justify-center max-w-[200px]'
										onClick={() => {
											if (store.lat && store.lng) {
												try {
													Eitri.navigation.openExternalLink(
														`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`
													)
												} catch (e) {
													console.log('Error opening map')
												}
											}
										}}>
										<Text className='text-white font-bold text-[12px] tracking-wide'>
											VER NO MAPA
										</Text>
									</View>
								</View>
							)
						})
					)}
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
