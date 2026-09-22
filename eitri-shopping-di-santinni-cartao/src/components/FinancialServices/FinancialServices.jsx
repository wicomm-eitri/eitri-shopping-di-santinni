import { View, Text, Image } from 'eitri-luminus'
import { formatPrice } from '../../utils/utils'

// TODO: definir destino (link/rota) dos serviços financeiros
const FINANCIAL_SERVICES = [
	{
		title: 'Saúde Di Santinni',
		price: 32.9,
		description: 'Mantenha-se saudável sem comprometer suas finanças',
		image: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/489757e5-bfa3-451e-9595-8e77f4ae1156___762cf25023eb6eb9fad4962d191c708f.png',
		onPress: () => {}
	},
	{
		title: 'Odonto Di Santinni',
		price: 27.9,
		description: 'Mantenha-se saudável sem comprometer suas finanças',
		image: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/d4ec16d3-ee17-4938-8f3d-e0f081593e7d___2eb0f68bb89cbfcc7527b6e39099aa5e.jpg',
		onPress: () => {}
	},
	{
		title: 'Seguro Di Santinni',
		price: 55.9,
		description: 'Mantenha a segurança com a Di Santinni',
		image: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/2f561cc8-2bb7-46df-a313-ec8d8a92d638___3b4474f435fe51a65e96ca90f4e45f72.png',
		onPress: () => {}
	},
	{
		title: 'Seguro Cartão Di Santinni',
		price: 18.9,
		description: 'Mantenha suas informações e compras protegidas',
		image: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/9801de73-c4a9-49e1-a825-a6284846a66d___0c97acf35b8039d2c4cd89100929429c.png',
		onPress: () => {}
	}
]

export default function FinancialServices() {
	return (
		<View className='flex flex-col gap-[10px]'>
			<Text className='text-sm font-semibold leading-5 tracking-[0.28px] text-black'>Serviços financeiros</Text>

			<View className='grid grid-cols-2 gap-x-[7px] gap-y-5'>
				{FINANCIAL_SERVICES.map(service => (
					<FinancialServiceCard
						key={service.title}
						service={service}
					/>
				))}
			</View>
		</View>
	)
}

function FinancialServiceCard(props) {
	const { service } = props

	return (
		<View
			className='flex flex-col gap-3'
			onClick={service.onPress}>
			<View className='w-full h-[86px] overflow-hidden rounded-lg bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'>
				<Image
					src={service.image}
					alt={service.title}
					className='w-full h-full object-cover'
				/>
			</View>

			<View className='flex flex-col gap-[10px]'>
				<Text className='text-xs font-semibold leading-6 tracking-[0.24px] bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent'>
					{service.title}
				</Text>

				<Text className='text-[10px] leading-5 tracking-[0.2px] text-black'>
					A partir de {formatPrice(service.price)}/Mês
				</Text>

				<View className='w-full h-px bg-[#BFBFBF]' />

				<Text className='text-[10px] leading-3 tracking-[0.2px] text-black'>{service.description}</Text>
			</View>
		</View>
	)
}
