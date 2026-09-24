import Eitri from 'eitri-bifrost'
import { Page } from 'eitri-luminus'
import BiometricsNotice from '../components/BiometricsNotice/BiometricsNotice'
import CardHeader from '../components/CardHeader/CardHeader'
import { navigate, PAGES } from '../services/NavigationService'

export default function LoanBiometrics(props) {
	const loan = props?.location?.state?.loan || {}

	const onBack = () => Eitri.navigation.back()

	const onPressAgree = () => navigate(PAGES.LOAN_IDENTITY, { loan })

	return (
		<Page
			title='Reconhecimento facial - Cartão Di Santinni'
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<BiometricsNotice
				currentStep={8}
				onPressAgree={onPressAgree}
			/>
		</Page>
	)
}
