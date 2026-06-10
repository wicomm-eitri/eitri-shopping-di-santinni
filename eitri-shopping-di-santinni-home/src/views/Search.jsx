import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { HeaderContentWrapper, HeaderReturn, HeaderWishList } from 'eitri-shopping-di-santinni-shared'
import ProductCatalogContent from '../components/ProductCatalogContent/ProductCatalogContent'
import SearchInput from '../components/SearchInput/SearchInput'
import { useLocalShoppingCart } from '../providers/LocalCart'

export default function Search(props) {
	const { t } = useTranslation()
	const incomingSearchTerm = props?.history?.location?.state?.searchTerm || props?.location?.state?.searchTerm

	const { startCart } = useLocalShoppingCart()

	const [params, setParams] = useState(null)
	const [pristine, setPristine] = useState(true)

	useEffect(() => {
		window.scroll(0, 0)

		if (incomingSearchTerm) {
			setPristine(false)
			// Criar objeto de parâmetros correto quando vem do banner
			const searchParams = {
				sort: 'release:desc',
				facets: [],
				query: incomingSearchTerm
			}

			setParams(searchParams)
		}

		Eitri.eventBus.subscribe({
			channel: 'onUserTappedActiveTab',
			callback: _ => {
				Eitri.navigation.backToTop()
			}
		})

		Eitri.navigation.setOnResumeListener(() => {
			startCart()
		})

		// Tracking.screenView('busca', 'Search')
	}, [])

	const handleSearchSubmit = async term => {
		if (term) {
			setPristine(false)
			Eitri.keyboard.dismiss()

			try {
				const params = {
					sort: 'release:desc',
					facets: [],
					query: term
				}

				//saveSearchHistory(term)
				setParams(params)
			} catch (error) {
				console.error('handleSearchSubmit', error)
			}
		}
	}

	return (
		<Page title={t('search.title', 'Tela de busca')}>
			<HeaderContentWrapper
				scrollEffect={false}
				className='relative bg-base-100 w-full'>
				<View className='relative flex items-center justify-between pt-4 px-4 w-screen gap-3'>
					<HeaderReturn />

					<View className='flex-1 flex items-center justify-center'>
						<Text className='text-xl font-semibold tracking-wide uppercase'>
							{t('brand.name', 'DI SANTINNI')}
						</Text>
					</View>

					<HeaderWishList
						onPress={() => {}}
						padding='none'
					/>
				</View>
			</HeaderContentWrapper>

			<View className='px-4 pt-8'>
				<SearchInput
					incomingValue={params?.query}
					onSubmit={handleSearchSubmit}
				/>
			</View>

			{pristine && (
				<View className='flex flex-col items-center justify-center py-12'>
					<svg
						className='mb-4 text-primary'
						width='80'
						height='80'
						viewBox='0 0 20 20'
						stroke='currentColor'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M8.33333 14.1667C9.09938 14.1667 9.85792 14.0158 10.5657 13.7226C11.2734 13.4295 11.9164 12.9998 12.4581 12.4581C12.9998 11.9164 13.4295 11.2734 13.7226 10.5657C14.0158 9.85792 14.1667 9.09938 14.1667 8.33333C14.1667 7.56729 14.0158 6.80875 13.7226 6.10101C13.4295 5.39328 12.9998 4.75022 12.4581 4.20854C11.9164 3.66687 11.2734 3.23719 10.5657 2.94404C9.85792 2.65088 9.09938 2.5 8.33333 2.5C6.78624 2.5 5.30251 3.11458 4.20854 4.20854C3.11458 5.30251 2.5 6.78624 2.5 8.33333C2.5 9.88043 3.11458 11.3642 4.20854 12.4581C5.30251 13.5521 6.78624 14.1667 8.33333 14.1667Z'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M17.5 17.5L12.5 12.5'
							stroke='currentColor'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
					<Text className='text-primary text-2xl font-bold text-center mb-2'>
						{t('search.pristineTitle', 'O que você está buscando?')}
					</Text>
					<Text className='text-base-content text-base text-center opacity-80'>
						{t('search.pristineDescription', 'Nos diga o que procura e achamos pra você')}
					</Text>
				</View>
			)}

			{params && (
				<ProductCatalogContent
					bottomInset={'auto'}
					params={params}
				/>
			)}
		</Page>
	)
}
