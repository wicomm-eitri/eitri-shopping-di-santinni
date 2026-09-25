import { View, Image } from 'eitri-luminus'
import { HeaderContentWrapper, HeaderReturn, HeaderLogo } from 'eitri-shopping-di-santinni-shared'
import logo from '../../assets/images/logoHeader.png'
import MenuIcon from '../../assets/icons/menu.svg'
import CloseIcon from '../../assets/icons/close.svg'
import { openMenu } from '../../services/NavigationService'

export default function CardHeader(props) {
	const { onBack, onClose, showMenu = true } = props

	const renderRightAction = () => {
		if (typeof onClose === 'function') {
			return (
				<View
					className='flex items-center'
					onClick={onClose}>
					<Image
						src={CloseIcon}
						alt='Fechar'
						className='w-6 h-6'
					/>
				</View>
			)
		}

		if (showMenu) {
			return (
				<View
					className='flex items-center'
					onClick={openMenu}>
					<Image
						src={MenuIcon}
						alt='Menu'
						className='w-6 h-6'
					/>
				</View>
			)
		}

		return <View className='w-6 h-6' />
	}

	return (
		<HeaderContentWrapper
			scrollEffect={false}
			className='justify-between !bg-snow'>
			<HeaderReturn
				className='w-6 h-6'
				onClick={onBack}
			/>
			<HeaderLogo src={logo} />
			{renderRightAction()}
		</HeaderContentWrapper>
	)
}
