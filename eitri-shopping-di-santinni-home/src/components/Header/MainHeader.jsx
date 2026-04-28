import Eitri from 'eitri-bifrost'
import { HeaderCart, HeaderContentWrapper, HeaderLogo, HeaderSearchIcon } from 'eitri-shopping-di-santinni-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { goToCartman } from '../../utils/utils'

export default function MainHeader() {
	const { cart } = useLocalShoppingCart()

	const navigateToSearch = () => {
		Eitri.navigation.navigate({
			path: 'Search'
		})
	}

	return (
		<HeaderContentWrapper
			scrollEffect={true}
			className='justify-between'>
			<View onClick={goToCartman}>
				<HeaderLogo />
			</View>

			<View className='flex items-center justify-between gap-[12px]'>
				<HeaderSearchIcon onClick={navigateToSearch} />

				<HeaderCart cart={cart} />
			</View>
		</HeaderContentWrapper>
	)
}
