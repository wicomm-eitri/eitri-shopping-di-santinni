import { useTranslation } from 'eitri-i18n'
import {
	Loading,
	HeaderContentWrapper,
	HeaderSearchIcon,
	HeaderLogo,
	HeaderCart
} from 'eitri-shopping-di-santinni-shared'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
import { getCmsContent } from '../services/CmsService'
import logo from '../assets/Image/logoHeader.png'
import { goToCart, goToSearch } from '../utils/utils'

export default function Categories() {
	const { t } = useTranslation()
	const [cmsContent, setCmsContent] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		loadCms()
	}, [])

	const loadCms = async () => {
		const { sections } = await getCmsContent('categories', 'teste-categorias')

		console.log('sections: ', sections)

		setCmsContent(sections)
		setIsLoading(false)
	}

	return (
		<Page
			className='bg-white h-screen min-h-screen'
			title={t('categories.title', 'Categorias')}
			bottomInset
			topInset>
			<HeaderContentWrapper className='justify-between'>
				<HeaderSearchIcon onClick={goToSearch} />
				<HeaderLogo src={logo} />
				<HeaderCart onClick={goToCart} />
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			<CmsContentRender
				cmsContent={cmsContent}
				type='categories'
			/>
		</Page>
	)
}
