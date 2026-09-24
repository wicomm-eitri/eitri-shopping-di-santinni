import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import BiometricsNotice from '../components/BiometricsNotice/BiometricsNotice'
import CardHeader from '../components/CardHeader/CardHeader'
import { REGISTER_TOTAL_STEPS } from '../utils/utils'

export default function RegisterBiometrics() {
	const { t } = useTranslation()

	const onBack = () => Eitri.navigation.back()

	// TODO: definir destino (link/rota) do botão
	const onPressAgree = () => {}

	return (
		<Page
			title={t('registerBiometrics.pageTitle', 'Reconhecimento facial - Cartão Di Santinni')}
			statusBarTextColor='black'>
			<CardHeader onBack={onBack} />

			<BiometricsNotice
				currentStep={3}
				totalSteps={REGISTER_TOTAL_STEPS}
				onPressAgree={onPressAgree}
			/>
		</Page>
	)
}
