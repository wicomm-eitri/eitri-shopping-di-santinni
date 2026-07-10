import { useEffect, useState } from 'react'
import Eitri from 'eitri-bifrost'
import { HeaderCart, HeaderContentWrapper, HeaderReturn, HeaderSearchIcon } from 'eitri-shopping-di-santinni-shared'
import HeaderLogo from '../../assets/Image/logoHeader.png'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { goToCartman } from '../../utils/utils'

export default function MainHeader(props) {
	const { isPLP = false } = props

	const { cart } = useLocalShoppingCart()

	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 0)

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
			scrollEffect
			className='relative bg-base-100 transition-all duration-500 ease-in-out'>
			<View className='relative flex items-center justify-between px-4 w-screen'>
				<View className='flex items-center gap-3'>
					{isPLP && <HeaderReturn />}

					<HeaderSearchIcon onClick={goToSearch} />
				</View>

				<View
					className='absolute left-[50%] translate-x-[-50%] flex items-center justify-center'
					onClick={goToCartman}>
					<Image
						src={HeaderLogo}
						alt='Logo'
					/>
				</View>

				<View className='flex items-center justify-end'>
					<HeaderCart cart={cart} />
				</View>
			</View>
		</HeaderContentWrapper>
	)
}
