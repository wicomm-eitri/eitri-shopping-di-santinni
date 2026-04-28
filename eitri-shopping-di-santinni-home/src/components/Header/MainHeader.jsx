import Eitri from 'eitri-bifrost'
import {
	HeaderCart,
	HeaderContentWrapper,
	HeaderLogo,
	HeaderReturn,
	HeaderSearchIcon
} from 'eitri-shopping-di-santinni-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { goToCartman } from '../../utils/utils'

export default function MainHeader(props) {
	const { isPLP = false, title } = props

	const { cart } = useLocalShoppingCart()

	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true)
			} else {
				setIsScrolled(false)
			}
		}

		window.addEventListener('scroll', handleScroll)

		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const goToSearch = () => {
		Eitri.navigation.navigate({
			path: 'Search'
		})
	}

	return (
		<HeaderContentWrapper
			isHome
			scrollEffect
			className={`${isScrolled || isPLP ? 'relative bg-base-100' : 'bg-transparent absolute'} transition-all duration-500 ease-in-out justify-center`}>
			<View className='flex justify-between items-center pt-8 w-screen'>
				<View
					className='flex items-center gap-3'
					onClick={goToCartman}>
					{isPLP && <HeaderReturn />}

					<HeaderLogo />
				</View>

				<View className='flex justify-between gap-[12px]'>
					<HeaderSearchIcon onClick={goToSearch} />

					<HeaderCart cart={cart} />
				</View>
			</View>
		</HeaderContentWrapper>
	)
}
