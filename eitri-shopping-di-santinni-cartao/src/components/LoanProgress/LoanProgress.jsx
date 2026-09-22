import { useState, useEffect } from 'react'
import { View, Image } from 'eitri-luminus'
import ProgressSparkIcon from '../../assets/icons/progress-spark.svg'

export const LOAN_TOTAL_STEPS = 10

export default function LoanProgress(props) {
	const { currentStep, totalSteps = LOAN_TOTAL_STEPS, completed } = props

	// Começa na fase anterior para animar o avanço ao entrar na tela
	const [displayStep, setDisplayStep] = useState(Math.max(currentStep - 1, 0))

	useEffect(() => {
		const timer = setTimeout(() => setDisplayStep(currentStep), 50)

		return () => clearTimeout(timer)
	}, [currentStep])

	const progress = Math.min(displayStep / totalSteps, 1) * 100

	return (
		<View className={`relative w-full ${completed ? 'h-[29px]' : 'h-2'}`}>
			<View
				className={`absolute bottom-0 left-0 h-2 overflow-hidden rounded-[5px] bg-[#F2F2F0] ${completed ? 'w-[calc(100%-32px)]' : 'w-full'}`}>
				<View
					className={`absolute top-0 left-0 h-2 rounded-[5px] transition-all duration-500 ease-out ${completed ? 'bg-gradient-to-b from-red-500 to-red-700' : 'bg-[#434343]'}`}
					style={{ width: `${progress}%` }}
				/>
			</View>

			{completed && (
				<Image
					src={ProgressSparkIcon}
					alt=''
					className='absolute top-0 left-[calc(100%-32px)] w-[21px] h-6'
				/>
			)}
		</View>
	)
}
