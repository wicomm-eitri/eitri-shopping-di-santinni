import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import BiometricsNotice from '../components/BiometricsNotice/BiometricsNotice'
import RegisterHeader from '../components/RegisterHeader/RegisterHeader'
import { navigate, PAGES } from '../services/NavigationService'
import { REGISTER_TOTAL_STEPS } from '../utils/utils'

export default function RegisterBiometrics() {
	const { t } = useTranslation()

	const onBack = () => Eitri.navigation.back()

	const onPressAgree = () => navigate(PAGES.REGISTER_IDENTITY)

	return (
		<Page
			title={t('registerBiometrics.pageTitle', 'Reconhecimento facial - Cartão Di Santinni')}
			statusBarTextColor='black'>
			<RegisterHeader onBack={onBack} />

			<BiometricsNotice
				currentStep={3}
				totalSteps={REGISTER_TOTAL_STEPS}
				onPressAgree={onPressAgree}
			/>
		</Page>
	)
}
