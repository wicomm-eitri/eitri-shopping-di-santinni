import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { BottomInset, Loading } from 'eitri-shopping-di-santinni-shared'
import ActionButton from '../components/ActionButton/ActionButton'
import Badges from '../components/Badges/Badges'
import ColorVariants from '../components/ColorVariants/ColorVariants'
import DescriptionComponent from '../components/Description/DescriptionComponent'
import Freight from '../components/Freight/Freight'
import Header from '../components/Header/Header'
import ImageCarousel from '../components/ImageCarousel/ImageCarousel'
import MainDescription from '../components/MainDescription/MainDescription'
import RecommendationProducts from '../components/RecommendationProducts/RecommendationProducts'
import RenderVideo from '../components/RenderVideo/RenderVideo'
import SkuSelector from '../components/SkuSelector/SkuSelector'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { startConfigure } from '../services/AppService'
import { saveCartIdOnStorage } from '../services/cartService'
import { productOnWishlist } from '../services/customerService'
import { getGroupedVariants, getProductById, getProductBySlug, markLastViewedProduct } from '../services/productService'
import { crashLog, sendScreenView, sendViewItem } from '../services/trackingService'

export default function Home() {
	const { startCart } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [product, setProduct] = useState(null)
	const [isLoading, setIsLoading] = useState(null)
	const [configLoaded, setConfigLoaded] = useState(false)
	const [currentSku, setCurrentSku] = useState(null)
	const [wishlistInfo, setWishlistInfo] = useState(null)
	const [colorVariants, setColorVariants] = useState([])

	useEffect(() => {
		window.scroll(0, 0)

		startHome()

		Eitri.navigation.setOnResumeListener(() => {
			startHome()
		})
	}, [])

	const startHome = async () => {
		setIsLoading(true)

		const startParams = await Eitri.getInitializationInfos()

		let product = await startParams.product

		await loadConfigs()

		if (!product) {
			product = await loadProduct(startParams)
		}

		if (product) {
			setProduct(product)
			setCurrentSku(findAvailableSKU(product))
			setColorVariants([])

			const wlInfo = await productOnWishlist(product.productId)

			setWishlistInfo(wlInfo)

			setIsLoading(false)

			loadColorVariants(product)
		}

		await loadCart(startParams)

		sendScreenView('PDP', 'home')
		sendViewItem(product)
		markLastViewedProduct(product)
	}

	const loadColorVariants = async product => {
		try {
			const variants = await getGroupedVariants(product)

			setColorVariants(variants)
		} catch (e) {
			console.error('loadColorVariants: Error', e)
		}
	}

	// Mesma regra de renderização do ColorVariants: se ele não for aparecer,
	// o SkuSelector volta a exibir o atributo "Cor"
	const showColorVariants = colorVariants?.length > 1 && colorVariants.some(variant => variant.isAvailable)

	const findAvailableSKU = product => {
		const availableSku = product.items.find(item =>
			item.sellers.some(seller => seller.commertialOffer?.AvailableQuantity > 0)
		)

		return availableSku || product.items[0]
	}

	const loadProduct = async startParams => {
		try {
			if (startParams.productId) {
				return await getProductById(startParams.productId)
			}

			if (startParams.slug) {
				return await getProductBySlug(startParams.slug)
			}
		} catch (e) {
			console.error('loadProduct: Error', e)

			return null
		}
	}

	const loadCart = async startParams => {
		if (startParams?.orderFormId) {
			await saveCartIdOnStorage(startParams?.orderFormId)
		}

		await startCart()
	}

	const loadConfigs = async () => {
		try {
			await startConfigure()
			setConfigLoaded(true)
		} catch (e) {
			crashLog('Erro ao buscar configurações', e)
			crashLog()
		}
	}

	const onSkuChange = newDesiredVariations => {
		const productSku = product.items.find(item => {
			return item.itemId === newDesiredVariations?.itemId
		})

		if (productSku) {
			setCurrentSku(productSku)
		}
	}

	const findBadges = () => {
		const badges = []

		// PARA TESTE, DEVE VIR DA API
		badges.push({
			textBold: '5%',
			textRegular: 'PIX'
		})
		badges.push({
			textBold: '5%',
			textRegular: 'Cartão DS'
		})

		product?.productCluster?.map(cluster => {
			if (cluster.name.includes('%')) {
				const [textBold, textRegular] = cluster.name.split('%')

				badges.push({
					textBold: textBold,
					textRegular: textRegular
				})
			} else {
				badges.push({
					textRegular: cluster.name
				})
			}
		})

		return badges
	}

	return (
		<Page
			statusBarTextColor='black'
			title={t('home.pageTitle', 'Página de produto')}
			bottomInset>
			<Header
				product={product}
				configLoaded={configLoaded}
				initialWishlistInfo={wishlistInfo}
			/>

			<Loading
				isLoading={isLoading}
				fullScreen
			/>

			{product && (
				<View>
					<View className='bg-[#F2F2F2]'>
						<ImageCarousel currentSku={currentSku} />

						<View className='mt-8 px-4 flex flex-col gap-4'>
							<View className='bg-white rounded-lg p-6 gap-4 flex flex-col'>
								<MainDescription
									product={product}
									currentSku={currentSku}
									initialWishlistInfo={wishlistInfo}
								/>

								<SkuSelector
									currentSku={currentSku}
									product={product}
									onSkuChange={onSkuChange}
									hideColorAttribute={showColorVariants}
								/>

								<ColorVariants
									currentProductId={product.productId}
									variants={colorVariants}
								/>

								<ActionButton currentSku={currentSku} />
							</View>
							{/* TODO: Esconder scrollbar no iOS quando a Eitri lançar o CSS */}

							<View className='flex items-center gap-2 mt-2 overflow-x-auto'>
								{findBadges()?.map((badge, index) => (
									<Badges
										key={index}
										textBold={badge.textBold}
										textRegular={badge.textRegular}
									/>
								))}
							</View>

							{configLoaded && <Freight currentSku={currentSku} />}

							<RenderVideo
								isMocked
								videoUrl={'https://shoulder.com.br/cdn/ecommerce/lps/2024/lpgetbeemob.mp4'}
							/>

							{/*<RichContent product={product} />*/}

							<DescriptionComponent product={product} />

							{/* <Reviews /> */}
						</View>
						{/* TODO: Anthonius - Alterar componente para deixar igual figma */}
						{configLoaded && <RecommendationProducts product={product} />}
					</View>

					<BottomInset />
				</View>
			)}
		</Page>
	)
}
