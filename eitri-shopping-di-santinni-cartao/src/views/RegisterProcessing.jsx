import { useState, useEffect } from 'react'
import { useTranslation } from 'eitri-i18n'
import LoanProgress from '../components/LoanProgress/LoanProgress'
import { navigate, PAGES } from '../services/NavigationService'

const PROCESSING_TOTAL_STEPS = 10

const PROCESSING_STEP_INTERVAL = 700

// Tempo para a barra terminar de preencher antes de sair da tela
const PROCESSING_REDIRECT_DELAY = 800

export default function RegisterProcessing() {
	const { t } = useTranslation()

	const [step, setStep] = useState(0)

	// TODO: o avanço da barra é simulado. Implementar o processamento real do cadastro, que depende da integração com a
	// API da Credsystem
	useEffect(() => {
		const isCompleted = step >= PROCESSING_TOTAL_STEPS

		const timer = setTimeout(
			() => {
				if (isCompleted) {
					navigate(PAGES.INVOICES, {}, true)

					return
				}

				setStep(current => current + 1)
			},
			isCompleted ? PROCESSING_REDIRECT_DELAY : PROCESSING_STEP_INTERVAL
		)

		return () => clearTimeout(timer)
	}, [step])

	return (
		<Page
			title={t('registerProcessing.pageTitle', 'Processando dados - Cartão Di Santinni')}
			statusBarTextColor='black'>
			<View className='flex flex-col items-center gap-[15px] px-16 pt-[34vh] bg-snow'>
				<Text className='text-lg font-semibold leading-6 tracking-[0.32px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{t('registerProcessing.title', 'Processando Dados')}
				</Text>

				<LoanProgress
					currentStep={step}
					totalSteps={PROCESSING_TOTAL_STEPS}
				/>
			</View>
		</Page>
	)
}
