import { View, Image } from 'eitri-luminus'
import { HeaderContentWrapper, HeaderReturn, HeaderLogo } from 'eitri-shopping-di-santinni-shared'
import logo from '../../assets/images/logoHeader.png'
import MenuIcon from '../../assets/icons/menu.svg'
import { openMenu } from '../../services/NavigationService'

export default function CardHeader(props) {
	const { onBack, showMenu = true } = props

	return (
		<HeaderContentWrapper
			scrollEffect={false}
			className='justify-between !bg-snow'>
			<HeaderReturn
				className='w-6 h-6'
				onClick={onBack}
			/>
			<HeaderLogo src={logo} />
			{showMenu ? (
				<View
					className='flex items-center'
					onClick={openMenu}>
					<Image
						src={MenuIcon}
						alt='Menu'
						className='w-6 h-6'
					/>
				</View>
			) : (
				<View className='w-6 h-6' />
			)}
		</HeaderContentWrapper>
	)
}
