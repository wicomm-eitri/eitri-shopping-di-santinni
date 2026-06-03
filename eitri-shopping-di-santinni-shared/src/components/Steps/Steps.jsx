import doneStep from '../../assets/Icons/doneStep.svg'
import nextStep from '../../assets/Icons/nextStep.svg'
import nowStep from '../../assets/Icons/nowStep.svg'

export default function Steps({ current = 0, steps = ['Entrega', 'Pagamento', 'Revisão'], images = {} }) {
	const defaultImages = { done: doneStep, current: nowStep, upcoming: nextStep }
	const imgs = { ...defaultImages, ...(images || {}) }

	return (
		<View className='px-4 pb-2 mt-[18px]'>
			<View className='relative mt-2 flex items-center justify-center w-full'>
				<View className='absolute left-10 right-0 top-3 z-0'>
					<View className='mx-6'>
						<View className='h-px w-[230px] bg-[#9A9A9A]' />
					</View>
				</View>

				{steps.map((label, idx) => {
					const status = idx < current ? 'done' : idx === current ? 'current' : 'upcoming'

					return (
						<View
							key={idx}
							className='flex flex-col items-center px-8 bg-transparent relative z-10'>
							{imgs && imgs[status] ? (
								<Image
									src={imgs[status]}
									className={`w-6 h-6 relative z-20 bg-white ${status === 'current' ? 'shadow-[0_0_0_4px_rgba(34,0,34,0.10)] rounded-full' : ''}`}
								/>
							) : (
								<View
									className={`w-6 h-6 rounded-full ${status === 'current' ? 'bg-primary' : 'bg-gray-200'} relative z-20`}
								/>
							)}

							<Text
								className={`text-sm  mt-1 ${status === 'current' ? 'text-red-700' : 'text-neutral-500'}`}>
								{label}
							</Text>
						</View>
					)
				})}
			</View>
		</View>
	)
}
