import { useTranslation } from 'eitri-i18n'
import personalIcon from '../../assets/images/personal.svg'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { navigate } from '../../services/navigationService'
import SimpleCard from '../Card/SimpleCard'
import OtpLogin from '../OtpLogin/OtpLogin'

export default function UserData(props) {
	const { cart, removeClientData } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [showOtpLogin, setShowOtpLogin] = useState(false)

	const clearClientData = async () => {
		try {
			if (cart?.clientProfileData) {
				await removeClientData()
				navigate('PersonalData')
			}
		} catch (e) {
			console.error('Erro ao limpar dados do cliente', e)
		}
	}

	const goToPersonalData = () => {
		try {
			navigate('PersonalData')
		} catch (e) {
			console.error('Erro ao navegar para a tela de dados pessoais', e)
		}
	}

	const onPressMainAction = async () => {
		try {
			if (!cart?.canEditData) {
				setShowOtpLogin(true)
			} else {
				goToPersonalData()
			}
		} catch (e) {
			console.error('Erro ao navegar para a tela de dados pessoais', e)
		}
	}

	return (
		<>
			<SimpleCard
				title={t('userData.txtPersonData', 'DADOS PESSOAIS')}
				isFilled={cart?.clientProfileData?.email}
				onPress={onPressMainAction}
				icon={personalIcon}>
				<View className='flex flex-col gap-2'>
					<Text className='text-xs text-gray-500 mb-1'>{`${cart?.clientProfileData?.firstName} ${cart?.clientProfileData?.lastName}`}</Text>
					<Text className='text-xs text-gray-500 mb-1'>Email: {cart?.clientProfileData?.email}</Text>
					<Text className='text-xs text-gray-500 mb-1'>Telefone: {cart?.clientProfileData?.phone}</Text>
				</View>
			</SimpleCard>
			<OtpLogin
				open={showOtpLogin}
				onClose={() => setShowOtpLogin(false)}
				onLogged={goToPersonalData}
			/>
		</>
	)
}
