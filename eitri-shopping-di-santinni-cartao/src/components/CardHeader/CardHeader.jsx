import { View, Image } from 'eitri-luminus'
import { HeaderContentWrapper, HeaderReturn, HeaderLogo } from 'eitri-shopping-di-santinni-shared'
import logo from '../../assets/images/logoHeader.png'
import MenuIcon from '../../assets/icons/menu.svg'
import { openAccount } from '../../services/NavigationService'

export default function CardHeader(props) {
	const { onBack } = props

	return (
		<HeaderContentWrapper
			scrollEffect={false}
			className='justify-between'
			containerClassName='!bg-snow'>
			<HeaderReturn
				className='w-6 h-6'
				onClick={onBack}
			/>
			<HeaderLogo src={logo} />
			<View
				className='flex items-center'
				onClick={openAccount}>
				<Image
					src={MenuIcon}
					alt='Menu'
					className='w-6 h-6'
				/>
			</View>
		</HeaderContentWrapper>
	)
}
