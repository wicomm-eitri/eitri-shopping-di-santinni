import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import MainHeader from '../components/Header/MainHeader'
import ProductCatalogContent from '../components/ProductCatalogContent/ProductCatalogContent'

export default function ProductCatalog(props) {
	const { location } = props

	const { t } = useTranslation()

	const title = location.state.title
	const openInBottomBar = !!location.state.openInBottomBar

	const [appliedFacets, setAppliedFacets] = useState(null)

	useEffect(() => {
		const params = location.state.params

		setAppliedFacets(params)

		if (!openInBottomBar) {
			Eitri.eventBus.subscribe({
				channel: 'onUserTappedActiveTab',
				callback: _ => {
					Eitri.navigation.back()
				}
			})
		}
	}, [])

	const goToSearch = () => Eitri.navigation.navigate({ path: 'Search' })

	return (
		<Page title={title || t('productCatalog.title', 'Catálogo')}>
			<>
				<MainHeader isPLP />

				<View className='flex justify-center items-center px-4 my-4'>
					<Text className='text-xl font-semibold text-center w-full'>
						{title || t('productCatalog.title', 'Catálogo')}
					</Text>
				</View>

				{appliedFacets && (
					<ProductCatalogContent
						banner={location?.state?.banner}
						params={appliedFacets}
					/>
				)}
			</>
		</Page>
	)
}
