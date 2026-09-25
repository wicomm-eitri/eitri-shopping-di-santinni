import { View, Image } from 'eitri-luminus'
import { HeaderContentWrapper, HeaderReturn, HeaderLogo } from 'eitri-shopping-di-santinni-shared'
import CloseIcon from '../../assets/icons/close.svg'
import MenuIcon from '../../assets/icons/menu.svg'
import logo from '../../assets/images/logoHeader.png'
import { openMenu } from '../../services/NavigationService'

export default function CardHeader(props) {
	const { onBack, showMenu = true, onClose } = props

	return (
		<HeaderContentWrapper
			scrollEffect={false}
			className='justify-between !bg-snow'>
			<HeaderReturn
				className='w-6 h-6'
				onClick={onBack}
			/>
			<HeaderLogo src={logo} />
			{onClose ? (
				<View
					className='flex items-center'
					onClick={onClose}>
					<Image
						src={CloseIcon}
						alt='Fechar'
						className='w-6 h-6'
					/>
				</View>
			) : showMenu ? (
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
