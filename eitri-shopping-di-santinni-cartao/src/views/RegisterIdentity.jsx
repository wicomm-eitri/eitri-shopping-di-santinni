import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import IdentityPhoto from '../components/IdentityPhoto/IdentityPhoto'
import RegisterHeader from '../components/RegisterHeader/RegisterHeader'
import { navigate, PAGES } from '../services/NavigationService'
import { REGISTER_TOTAL_STEPS } from '../utils/utils'

export default function RegisterIdentity() {
	const { t } = useTranslation()

	const onBack = () => Eitri.navigation.back()

	const onPressContinue = () => navigate(PAGES.REGISTER_SELFIE)

	return (
		<Page
			title={t('registerIdentity.pageTitle', 'Confirmar identidade - Cartão Di Santinni')}
			statusBarTextColor='black'>
			<RegisterHeader onBack={onBack} />

			<IdentityPhoto
				currentStep={4}
				totalSteps={REGISTER_TOTAL_STEPS}
				buttonLabel={t('registerIdentity.continue', 'Continuar')}
				onPressAction={onPressContinue}
			/>
		</Page>
	)
}
