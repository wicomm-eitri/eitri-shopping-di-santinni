import Card from '../../../components/Icons/MethodIcons/Card'
import { navigate } from '../../../services/navigationService'
import GroupsWrapper from './GroupsWrapper'

export default function StoreCard(props) {
	const { systemGroup } = props

	const addNewCard = async () => {
		navigate('StoreCardForm', { systemGroup })
	}

	return (
		<>
			<GroupsWrapper
				title='Cartão Di Santinni'
				showArrow={true}
				icon={<Card />}
				onPress={addNewCard}></GroupsWrapper>
		</>
	)
}
