import { useTranslation } from 'eitri-i18n'
import personalIcon from '../../assets/images/personal.svg'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import SimpleCard from '../Card/SimpleCard'

export default function UserData(props) {
	const { cart } = useLocalShoppingCart()
	const { t } = useTranslation()

	return (
		<SimpleCard
			title={t('userData.txtPersonData', 'DADOS PESSOAIS')}
			isFilled={cart?.clientProfileData?.email}
			icon={personalIcon}>
			<View className='flex flex-col gap-2'>
				<Text className='text-xs text-gray-500 mb-1'>{`${cart?.clientProfileData?.firstName} ${cart?.clientProfileData?.lastName}`}</Text>
				<Text className='text-xs text-gray-500 mb-1'>Email: {cart?.clientProfileData?.email}</Text>
				<Text className='text-xs text-gray-500 mb-1'>Telefone: {cart?.clientProfileData?.phone}</Text>
			</View>
		</SimpleCard>
	)
}
