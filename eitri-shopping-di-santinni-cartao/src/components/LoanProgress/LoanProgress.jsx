import { useState, useEffect } from 'react'
import { View } from 'eitri-luminus'

export const LOAN_TOTAL_STEPS = 9

export default function LoanProgress(props) {
	const { currentStep, totalSteps = LOAN_TOTAL_STEPS } = props

	// Começa na fase anterior para animar o avanço ao entrar na tela
	const [displayStep, setDisplayStep] = useState(Math.max(currentStep - 1, 0))

	useEffect(() => {
		const timer = setTimeout(() => setDisplayStep(currentStep), 50)

		return () => clearTimeout(timer)
	}, [currentStep])

	const progress = Math.min(displayStep / totalSteps, 1) * 100

	return (
		<View className='relative w-full h-2 overflow-hidden rounded-[5px] bg-[#F2F2F0]'>
			<View
				className='absolute top-0 left-0 h-2 rounded-[5px] bg-[#434343] transition-all duration-500 ease-out'
				style={{ width: `${progress}%` }}
			/>
		</View>
	)
}
