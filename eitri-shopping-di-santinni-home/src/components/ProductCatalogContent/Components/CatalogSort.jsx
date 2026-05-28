import { useState } from 'react'
import { useTranslation } from 'eitri-i18n'
import { View, Text } from 'eitri-luminus'
import { LIST_ORDERING } from '../../../utils/lists'
import CustomModal from '../../CustomModal/CustomModal'

export default function CatalogSort(props) {
	const { currentSort, onSortChange } = props

	const [showModal, setShowModal] = useState(false)

	const { t } = useTranslation()

	const handleSortSelect = sortValue => {
		onSortChange(sortValue)
		setShowModal(false)
	}

	const getCurrentSortLabel = () => {
		const currentOption = LIST_ORDERING.values.find(option => option.value === currentSort)

		return currentOption ? t(currentOption.name, '') : t('lists.labelRelevance', 'Relevância')
	}

	return (
		<>
			<View
				onClick={() => setShowModal(true)}
				className='flex h-[45px] w-full items-center justify-center gap-2 rounded border border-gray-500 bg-transparent px-4'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='16'
					height='16'
					viewBox='0 0 16 16'
					fill='none'>
					<path
						d='M3.3335 7.99996V2.66663'
						stroke='#888888'
						strokeLinecap='round'
					/>
					<path
						d='M12.6665 13.3334V11.3334'
						stroke='#888888'
						strokeLinecap='round'
					/>
					<path
						d='M3.3335 13.3333V10.6666'
						stroke='#888888'
						strokeLinecap='round'
					/>
					<path
						d='M12.6665 8.66663V2.66663'
						stroke='#888888'
						strokeLinecap='round'
					/>
					<path
						d='M8 4.66663V2.66663'
						stroke='#888888'
						strokeLinecap='round'
					/>
					<path
						d='M8 13.3334V7.33337'
						stroke='#888888'
						strokeLinecap='round'
					/>
					<path
						d='M3.33333 10.6667C4.06971 10.6667 4.66667 10.0697 4.66667 9.33333C4.66667 8.59695 4.06971 8 3.33333 8C2.59695 8 2 8.59695 2 9.33333C2 10.0697 2.59695 10.6667 3.33333 10.6667Z'
						stroke='#888888'
						strokeLinecap='round'
					/>
					<path
						d='M7.99984 7.33329C8.73622 7.33329 9.33317 6.73634 9.33317 5.99996C9.33317 5.26358 8.73622 4.66663 7.99984 4.66663C7.26346 4.66663 6.6665 5.26358 6.6665 5.99996C6.6665 6.73634 7.26346 7.33329 7.99984 7.33329Z'
						stroke='#888888'
						strokeLinecap='round'
					/>
					<path
						d='M12.6668 11.3333C13.4032 11.3333 14.0002 10.7363 14.0002 9.99996C14.0002 9.26358 13.4032 8.66663 12.6668 8.66663C11.9304 8.66663 11.3335 9.26358 11.3335 9.99996C11.3335 10.7363 11.9304 11.3333 12.6668 11.3333Z'
						stroke='#888888'
						strokeLinecap='round'
					/>
				</svg>
				<Text className='text-xs uppercase text-gray-500'>{getCurrentSortLabel()}</Text>
			</View>

			<CustomModal
				open={showModal}
				onClose={() => setShowModal(false)}>
				<View
					bottomInset={'auto'}
					className='bg-white rounded-t w-full max-h-[70vh] overflow-y-auto pointer-events-auto p-4'>
					<Text className='text-lg font-semibold uppercase'>{t('lists.title', 'Ordenar por')}</Text>

					<View className='flex flex-col mt-4'>
						{LIST_ORDERING.values.map((option, index) => (
							<View
								key={option.value}
								onClick={() => handleSortSelect(option.value)}
								className={`flex flex-row items-center justify-between p-4 cursor-pointer transition-colors ${
									currentSort === option.value
										? 'bg-primary/10 border-l-4 border-primary'
										: 'border-l-4 border-transparent'
								}`}>
								<Text
									className={`text-base ${
										currentSort === option.value ? 'text-primary font-medium' : 'text-gray-700'
									}`}>
									{t(option.name, '')}
								</Text>
								{currentSort === option.value && (
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='20'
										height='20'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className='text-primary'>
										<polyline points='20,6 9,17 4,12' />
									</svg>
								)}
							</View>
						))}
					</View>

					<View className='mb-4'>
						<View
							onClick={() => setShowModal(false)}
							className='flex h-[45px] w-full items-center justify-center rounded bg-red-700 px-4'>
							<Text className='font-bold text-white uppercase'>{t('lists.cancel', 'Cancelar')}</Text>
						</View>
					</View>
				</View>
			</CustomModal>
		</>
	)
}
