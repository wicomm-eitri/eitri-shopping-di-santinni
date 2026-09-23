import { formatPrice } from '../../utils/utils'
import LimitRing from '../LimitRing/LimitRing'

export default function AvailableLimitCard(props) {
	const { totalLimit, usedLimit } = props

	const total = Math.max(Number(totalLimit) || 0, 0)
	const used = Math.max(Number(usedLimit) || 0, 0)

	const availableLimit = Math.max(total - used, 0)
	const usedRatio = total ? Math.min(used / total, 1) : 0

	return (
		<View className='flex flex-row items-center justify-between px-6 py-5 rounded-lg bg-[#F8F9FA] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)]'>
			<View className='flex flex-col gap-[5px]'>
				<Text className='text-xs font-medium leading-6 text-[#8C8C8C]'>Limite disponível</Text>

				<Text className='text-base font-semibold leading-5 text-black'>{formatPrice(availableLimit)}</Text>
			</View>

			<LimitRing usedRatio={usedRatio} />
		</View>
	)
}
