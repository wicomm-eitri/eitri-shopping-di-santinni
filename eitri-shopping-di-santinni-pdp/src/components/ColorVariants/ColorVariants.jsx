import { useTranslation } from 'eitri-i18n'
import { COR_MAP } from '../SkuSelector/SkuSelector'
import { openProductVariant } from '../../services/NavigationService'

function VariantSwatch({ color, image, selected, unavailable, onClick }) {
	const hex = COR_MAP[color?.toLowerCase()] || '#eee'

	return (
		<View
			onClick={!unavailable ? onClick : undefined}
			className={`
				relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center
				${selected ? 'cursor-default ring-2 ring-black' : 'ring-1 ring-[#D5D5D5]'}
				${unavailable ? 'opacity-50 cursor-not-allowed' : ''}
				${!selected && !unavailable ? 'cursor-pointer' : ''}
			`}
			style={{ backgroundColor: hex }}>
			{image && (
				<Image
					src={image}
					className='w-full h-full object-cover'
				/>
			)}

			{unavailable && (
				<View className='absolute inset-0 flex items-center justify-center rounded-full overflow-hidden'>
					<View className='absolute w-[120%] h-[1.5px] bg-white opacity-70 rotate-45' />
				</View>
			)}
		</View>
	)
}

export default function ColorVariants({ currentProductId, variants }) {
	const { t } = useTranslation()

	// Mesma regra do site: só renderiza com mais de um produto no agrupador e pelo menos um disponível
	if (!variants || variants.length <= 1 || !variants.some(variant => variant.isAvailable)) return null

	return (
		<View className='flex flex-col gap-3'>
			<Text className='text-sm leading-6 font-semibold capitalize'>
				{t('colorVariants.txtColor', 'Cor')}
			</Text>

			<View className='flex flex-wrap gap-3'>
				{variants.map(variant => {
					const selected = variant.productId === currentProductId

					return (
						<VariantSwatch
							key={variant.productId}
							color={variant.cor ?? variant.productName}
							image={variant.imageUrl}
							selected={selected}
							unavailable={!variant.isAvailable}
							onClick={() => !selected && openProductVariant(variant.productId)}
						/>
					)
				})}
			</View>
		</View>
	)
}
