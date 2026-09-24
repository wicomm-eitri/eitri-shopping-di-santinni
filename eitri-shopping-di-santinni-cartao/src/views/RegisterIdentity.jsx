import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import CardHeader from '../components/CardHeader/CardHeader'
import IdentityPhoto from '../components/IdentityPhoto/IdentityPhoto'
import { REGISTER_TOTAL_STEPS } from '../utils/utils'

export default function RegisterIdentity() {
	const { t } = useTranslation()

	const onBack = () => Eitri.navigation.back()

	// TODO: definir destino (link/rota) do botão (a tela de Selfie ainda não existe)
	const onPressContinue = () => {}

	return (
		<Page
			title={t('registerIdentity.pageTitle', 'Confirmar identidade - Cartão Di Santinni')}
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<IdentityPhoto
				currentStep={4}
				totalSteps={REGISTER_TOTAL_STEPS}
				buttonLabel={t('registerIdentity.continue', 'Continuar')}
				onPressAction={onPressContinue}
			/>
		</Page>
	)
}
