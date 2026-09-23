import { CustomButton } from 'eitri-shopping-di-santinni-shared'
import FlagIcon from '../../assets/icons/flag.svg'
import { formatPrice } from '../../utils/utils'

export default function InvoiceSummaryCard(props) {
	const { amount, dueDay, onPressSeeInvoice } = props

	return (
		<View className='flex flex-col justify-between h-[210px] px-6 pt-5 pb-[26px] rounded-[14px] bg-[#F8F9FA] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)]'>
			<View className='flex flex-col'>
				<View className='flex flex-row items-start justify-between'>
					<View className='flex flex-col gap-[10px]'>
						<Text className='text-xs leading-6 text-[#8C8C8C] font-semibold'>Fatura atual</Text>

						<Text className='text-2xl font-semibold leading-5 text-[#C8102E]'>{formatPrice(amount)}</Text>

						<View className='flex flex-row items-center gap-[6px]'>
							<Text className='text-xs leading-6 text-black'>Vence dia:</Text>
							<Text className='text-xs font-semibold leading-6 text-black'>{dueDay}</Text>
						</View>
					</View>

					<View className='flex flex-row items-center h-[31px] gap-[2px] pl-[2px] pr-[3px] rounded-[4px] border border-[#FFC126]'>
						<Image
							src={FlagIcon}
							alt=''
							className='w-4 h-4'
						/>

						<Text className='text-[10px] font-semibold leading-6 text-[#FFC126]'>Fatura Pendente</Text>
					</View>
				</View>
			</View>

			<CustomButton
				label='Ver fatura'
				backgroundColor='bg-[#C8102E]'
				className='!h-[34px]'
				textClassName='text-xs uppercase tracking-[0.24px]'
				onPress={onPressSeeInvoice}
			/>
		</View>
	)
}
