import {
	BottomInset,
	CustomButton,
	CustomInput,
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText
} from 'eitri-shopping-di-santinni-shared'
import ClockIcon from '../assets/icons/clock-icon.svg'
import DollarIcon from '../assets/icons/dollar-icon.svg'
import MegaphoneIcon from '../assets/icons/megaphone-icon.svg'
import PercentIcon from '../assets/icons/percent-icon.svg'
import ProtectionIcon from '../assets/icons/protection-icon.svg'
import RoyaltiesIcon from '../assets/icons/royalties-icon.svg'
import StoreIcon from '../assets/icons/store-icon.svg'
import TagIcon from '../assets/icons/tag-icon.svg'

function validateFormData(formData) {
	return {
		name: !formData.name ? 'Informe o Nome' : '',
		email: !formData.email ? 'Informe o Email' : '',
		phone: !formData.phone ? 'Informe o Celular' : '',
		state: !formData.state ? 'Informe o Estado' : '',
		city: !formData.city ? 'Informe a Cidade' : '',
		investment_value: !formData.investment_value ? 'Informe o Valor de Investimento' : ''
	}
}

export default function BecomeAFranchisee() {
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		city: '',
		state: '',
		investment_value: ''
	})
	const [touched, setTouched] = useState({})

	const errors = useMemo(() => validateFormData(formData), [formData])

	const isValidFormData = useMemo(() => {
		return !Object.values(errors).some(Boolean)
	}, [errors])

	const onBlur = field => {
		setTouched(prev => ({ ...prev, [field]: true }))
	}

	const handleFormDataChange = useCallback((key, e) => {
		const { value } = e.target

		setFormData(prev => ({
			...prev,
			[key]: value
		}))
	}, [])

	const handleSubmit = async () => {
		if (isLoading) return

		setIsLoading(true)

		try {
			console.log('DATA =>', formData)

			// Enquanto n resolvemos os Cookies
			return null

			// const payload = {
			// 	dwfrm_franquia_nome: formData.name,
			// 	dwfrm_franquia_email: formData.email,
			// 	dwfrm_franquia_telefone: formData.phone,
			// 	dwfrm_franquia_cidade: formData.city,
			// 	dwfrm_franquia_states_stateCode: formData.state,
			// 	dwfrm_franquia_investimento_investimentoValue: formData.investment_value
			// }

			// const response = await Eitri.http.post(
			// 	'https://www.disantinni.com.br/on/demandware.store/Sites-di-santinni-Site/default/Franquia-SaveLead',
			// 	payload,
			// 	{
			// 		headers: {
			// 			'Accept': 'application/json, text/javascript, */*; q=0.01',
			// 			'Accept-Language': 'pt-BR,pt;q=0.9',
			// 			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			// 			'X-Requested-With': 'XMLHttpRequest',
			// 			'Origin': 'https://www.disantinni.com.br',
			// 			'Referer': 'https://www.disantinni.com.br/franquiasds.html',
			// 			'Cookie':
			// 				'sid=LKiMaEMnZSEy5JpSe7JgcSAsP2eRd8T7yuE; dwsid=YdGYAQRM-tFLHW-huZkyGW1VKw7WHFsLsxjQzzt9op_DApNljGmbKoLivI67LHgLLRHEIA80I7UxwI8gB1X-JQ=='
			// 		}
			// 	}
			// )

			// console.log('response =>', response.data)
		} catch (e) {
			console.error('Error on submit [BecomeAFranchisee]', e)
		} finally {
			setIsLoading(false)
		}
	}

	const states = [
		{ label: 'Acre', value: 'AC' },
		{ label: 'Alagoas', value: 'AL' },
		{ label: 'Amapá', value: 'AP' },
		{ label: 'Amazonas', value: 'AM' },
		{ label: 'Bahia', value: 'BA' },
		{ label: 'Ceará', value: 'CE' },
		{ label: 'Distrito Federal', value: 'DF' },
		{ label: 'Espírito Santo', value: 'ES' },
		{ label: 'Goiás', value: 'GO' },
		{ label: 'Maranhão', value: 'MA' },
		{ label: 'Mato Grosso', value: 'MT' },
		{ label: 'Mato Grosso do Sul', value: 'MS' },
		{ label: 'Minas Gerais', value: 'MG' },
		{ label: 'Pará', value: 'PA' },
		{ label: 'Paraíba', value: 'PB' },
		{ label: 'Paraná', value: 'PR' },
		{ label: 'Pernambuco', value: 'PE' },
		{ label: 'Piauí', value: 'PI' },
		{ label: 'Rio de Janeiro', value: 'RJ' },
		{ label: 'Rio Grande do Norte', value: 'RN' },
		{ label: 'Rio Grande do Sul', value: 'RS' },
		{ label: 'Rondônia', value: 'RO' },
		{ label: 'Roraima', value: 'RR' },
		{ label: 'Santa Catarina', value: 'SC' },
		{ label: 'São Paulo', value: 'SP' },
		{ label: 'Sergipe', value: 'SE' },
		{ label: 'Tocantins', value: 'TO' }
	]

	const valueOfInvestimentsData = [
		{ label: 'R$ 500.000 até R$ 600.000', value: 'R$ 500.000 até R$ 600.000' },
		{ label: 'R$ 600.000 até R$ 700.000', value: 'R$ 600.000 até R$ 700.000' },
		{ label: 'R$ 700.000 até R$ 800.000', value: 'R$ 700.000 até R$ 800.000' },
		{ label: 'R$ 800.000 até R$ 1.000.000', value: 'R$ 800.000 até R$ 1.000.000' },
		{ label: 'A partir de R$ 1.000.000', value: 'A partir de R$ 1.000.000' }
	]

	return (
		<Page title='Seja um franqueado'>
			<HeaderContentWrapper>
				<HeaderReturn />

				<HeaderText text='Seja um franqueado' />
			</HeaderContentWrapper>

			<Image
				src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/d465fccf-4e9a-4bdc-a5a8-3cf8d19f2979___c233b66eab95bf3211839cc8f15f9607.png'
				alt='Imagem de 2 mulheres'
			/>

			<View className='flex flex-col gap-4 pt-8 pb-10 px-8 text-center'>
				<Text className='text-[32px] text-center'>
					NOSSA <Text className='text-red-700 font-black'>LEGADO</Text>
				</Text>

				<Text>
					Nós somos a Di Santinni, e nossa história começou em 1980, como uma pequena fábrica de calçados.
					Movidos pela paixão de levar ao mercado modelos exclusivos e preços justos, demos um grande passo em
					1986, quando inauguramos nossa primeira loja no Norte Shopping, no Rio de Janeiro. Desde então,
					confirmamos nossa vocação para o comércio, unindo qualidade, competitividade e o compromisso de
					fazer parte do seu dia à dia.
					<br /> Hoje, somos uma grande equipe com mais de 4.500 colaboradores e mais de 35 mil m² dedicados
					ao varejo. Recebemos, todos os meses, 4,3 milhões de clientes em nossas lojas, e esses resultados
					nos inspiram a continuar crescendo e nos destacando como referência no mercado de calçados.
					<br /> Estamos sempre em movimento, desbravando possibilidades de fazer mais e melhor, nosso
					instinto empreendedor cresce a cada dia. Somos especialistas no que fazemos porque ouvimos e
					valorizamos nosso cliente, que está no centro de tudo o que construímos. Com mais de 140 lojas
					distribuídas por estados como Alagoas, Pará, Amazonas, Rondônia, Pernambuco, Maranhão, Paraíba,
					Sergipe, Rio Grande do Norte e, principalmente, no Rio de Janeiro, além da nossa loja online,
					conseguimos alcançar todos os cantos do Brasil. <br />
					Não importa onde você esteja, sempre teremos uma opção para seguirmos juntos, passo a passo!
				</Text>
			</View>

			<View className='relative pt-8 pb-16'>
				<Image
					src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/1a144ba4-4bef-4337-8837-e15794a42721___9313e2b9fb30ab630283a3bab3f38390.png'
					alt='Imagem background'
					className='w-full h-full absolute top-0'
				/>

				<View className='relative flex flex-col items-center gap-4 w-full'>
					<Text className='text-[32px] leading-8 text-base-100 text-center font-bold px-10'>
						SEJA UM FRANQUEADO DS
					</Text>

					<Text className='text-sm text-base-100 text-center font-semibold px-10'>
						Qorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a,
						mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut
						interdum tellus elit sed.
					</Text>

					<View className='flex flex-col gap-3 mt-4 bg-white shadow-[0_4px_6px_0_rgba(0,0,0,0.10)] rounded-3xl p-6 mx-4'>
						<Text className='text-2xl text-red-700 font-bold'>VAMOS CONVERSAR?</Text>

						<Text className='text-sm'>
							Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit
							interdum
						</Text>

						<View className='flex flex-col gap-4'>
							<View className='flex flex-col gap-2'>
								<View>
									<CustomInput
										placeholder='Nome'
										value={formData?.name || ''}
										onChange={e => handleFormDataChange('name', e)}
										className={`bg-white text-sm text-gray-300 ${errors.name && touched.name ? '!border-red-500' : ''}`}
										onBlur={() => onBlur('name')}
									/>
									{errors.name && touched.name && (
										<Text className='text-xs text-red-500'>{errors.name}</Text>
									)}
								</View>

								<View>
									<CustomInput
										placeholder='Email'
										value={formData?.email || ''}
										onChange={value => handleFormDataChange('email', value)}
										className={`bg-white text-sm text-gray-300 ${errors.email && touched.email ? '!border-red-500' : ''}`}
										onBlur={() => onBlur('email')}
									/>
									{errors.email && touched.email && (
										<Text className='text-xs text-red-500'>{errors.email}</Text>
									)}
								</View>

								<View>
									<CustomInput
										placeholder='Celular'
										value={formData?.phone || ''}
										onChange={value => handleFormDataChange('phone', value)}
										className={`bg-white text-sm text-gray-300 ${errors.phone && touched.phone ? '!border-red-500' : ''}`}
										onBlur={() => onBlur('phone')}
									/>
									{errors.phone && touched.phone && (
										<Text className='text-xs text-red-500'>{errors.phone}</Text>
									)}
								</View>

								<View>
									<Select
										placeholder='Estado'
										className={`text-sm bg-white text-gray-300 w-full ${errors.state && touched.state ? '!border-red-500' : ''}`}
										menuClassName='text-sm text-gray-300'
										onBlur={() => onBlur('state')}
										onChange={value => handleFormDataChange('state', value)}>
										{states.map(state => (
											<Select.Item
												key={state.label}
												value={state.value}>
												{state.label}
											</Select.Item>
										))}
									</Select>

									{errors.state && touched.state && (
										<Text className='text-xs text-red-500'>{errors.state}</Text>
									)}
								</View>

								<View>
									<CustomInput
										placeholder='Cidade'
										value={formData?.city || ''}
										onChange={value => handleFormDataChange('city', value)}
										className={`bg-white text-sm text-gray-300 ${errors.city && touched.city ? '!border-red-500' : ''}`}
										onBlur={() => onBlur('city')}
									/>
									{errors.city && touched.city && (
										<Text className='text-xs text-red-500'>{errors.city}</Text>
									)}
								</View>

								<View>
									<Select
										placeholder='Valor de investimento'
										className={`text-sm bg-white text-gray-300 w-full ${errors.investment_value && touched.investment_value ? '!border-red-500' : ''}`}
										menuClassName='text-sm text-gray-300'
										onBlur={() => onBlur('investment_value')}
										onChange={value => handleFormDataChange('investment_value', value)}>
										{valueOfInvestimentsData.map(value => (
											<Select.Item
												key={value.label}
												value={value.value}>
												{value.label}
											</Select.Item>
										))}
									</Select>

									{errors.investment_value && touched.investment_value && (
										<Text className='text-xs text-red-500'>{errors.investment_value}</Text>
									)}
								</View>
							</View>

							<CustomButton
								className='!rounded-[110px]'
								label={isLoading ? 'AGUARDE...' : 'SOLICITAR PROPOSTA'}
								disabled={!isValidFormData || isLoading}
								onClick={() => {
									// Marca todos os campos como tocados ao tentar submeter
									setTouched({
										postalCode: true,
										street: true,
										neighborhood: true,
										city: true,
										state: true,
										receiverName: true,
										number: true
									})
									handleSubmit()
								}}
								isLoading={isLoading}
							/>
						</View>
					</View>
				</View>
			</View>

			<View className='flex flex-col gap-5 py-12'>
				<Text className='text-[28px] font-black text-center uppercase px-11'>
					Por que investir na Di Santinni
				</Text>

				<View className='flex flex-col gap-8 items-center px-4'>
					{[
						{
							title: 'Marca consolidada',
							subtitle: '+ de 45 anos de experiência no varejo de calçados.'
						},
						{
							title: 'Modelo multimarcas',
							subtitle: 'Variedade que aumenta a atratividade para o cliente.'
						},
						{
							title: 'Marca própria forte',
							subtitle: 'Produtos exclusivos com alta competitividade.'
						},
						{
							title: 'Excelente custo-benefício',
							subtitle: 'Oferta que atende o grande público brasileiro.'
						},
						{
							title: 'Know-how de varejo',
							subtitle: 'Experiência de operação e gestão de loja.'
						}
					].map((item, index) => (
						<View
							key={`${item.title}-${index}`}
							className='flex flex-col items-center'>
							<Text className='font-black text-red-700 uppercase'>{item.title}</Text>

							<Text className='text-sm text-center text-gray-700'>{item.subtitle}</Text>
						</View>
					))}
				</View>
			</View>

			<View className='flex justify-center px-4'>
				<Image
					src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/6ef0473c-4c68-4b52-9139-24bc10aefee2___f563ca00e1b9df18d5d4d2fafef568a2.png'
					alt='Mulher passando cartão na maquininha'
					className='rounded-3xl'
				/>
			</View>

			<View className='flex flex-col pt-12 gap-4'>
				<Text className='text-[28px] text-red-700 font-black uppercase text-center'>
					a força da <br />
					nossa operação
				</Text>

				<View className='relative'>
					<Image
						src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/66d78827-fce0-4c64-809f-4a4dd358d304___2ba935f1e8ca7e814639fb1a113c6ef8.png'
						alt='Imagem de um galpão'
						className='w-full'
					/>

					<View className='absolute bottom-12 left-0 px-2 flex gap-4 overflow-x-auto w-full'>
						{[
							'Logística Estruturada',
							'Curadoria de Produtos',
							'Inteligência Comercial',
							'Tecnologia de Gestão'
						].map((text, index) => (
							<View
								key={`${text}-${index}`}
								className='flex items-center justify-center bg-red-700 rounded-lg h-[60px] px-6 min-w-[288px]'>
								<Text className='text-xl font-semibold text-base-100'>{text}</Text>
							</View>
						))}
					</View>
				</View>
			</View>

			<View className='relative py-[54px]'>
				<Image
					src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/7f6f1463-ed8f-455e-8b41-92dda37b1791___e4160655af688e0c1c2f888f0d54c06a.png'
					alt='Imagem de uma pessoa'
					className='w-full h-full absolute top-0'
				/>

				<View className='relative flex flex-col gap-11 px-5'>
					<Text className='text-[28px] leading-8 font-black text-center text-base-100 uppercase px-10'>
						nossos números de franquia
					</Text>

					<View className='grid grid-cols-2 gap-x-3 gap-y-8'>
						{[
							{
								icon: <Image src={StoreIcon} />,
								title: (
									<Text className='text-white text-sm text-center'>
										Lojas a partir de <br />
										<Text className='font-semibold'>150 m2</Text>
									</Text>
								)
							},
							{
								icon: <Image src={MegaphoneIcon} />,
								title: (
									<Text className='text-white text-sm text-center'>
										Fundo de propaganda
										<br />
										<Text className='font-semibold'>1% sobre o faturamento</Text>
									</Text>
								)
							},
							{
								icon: <Image src={DollarIcon} />,
								title: (
									<Text className='text-white text-sm text-center'>
										Faturamento médio mensal de
										<Text className='font-semibold'> R$350 mil</Text>
									</Text>
								)
							},
							{
								icon: <Image src={ClockIcon} />,
								title: (
									<Text className='text-white text-sm text-center font-semibold'>
										Payback a partir de 24 meses
									</Text>
								)
							},
							{
								icon: <Image src={PercentIcon} />,
								title: (
									<Text className='text-white text-sm text-center'>
										Rentabilidade de
										<br />
										<Text className='font-semibold'>10% a 15%</Text>
									</Text>
								)
							},
							{
								icon: <Image src={ProtectionIcon} />,
								title: (
									<Text className='text-white text-sm text-center font-semibold'>
										Sem imposição de compra
									</Text>
								)
							},
							{
								icon: <Image src={TagIcon} />,
								title: (
									<Text className='text-white text-sm text-center font-semibold'>
										Markup inicial <br />
										médio 2,5
									</Text>
								)
							},
							{
								icon: <Image src={RoyaltiesIcon} />,
								title: (
									<Text className='text-white text-sm text-center font-semibold'>
										Royalties 6% sobre o faturamento.
									</Text>
								)
							}
						].map((item, index) => (
							<View
								key={index}
								className='flex flex-col items-center gap-4'>
								{item.icon}

								{item.title}
							</View>
						))}
					</View>
				</View>
			</View>

			<View className='flex flex-col gap-8 pt-12'>
				<Text className='text-[32px] leading-8 text-center text-gray-900'>
					LOJAS EM <br />
					<Text className='text-red-700 font-black'>OPERAÇÃO</Text>
				</Text>

				<View className='flex justify-center px-7 pt-2'>
					<Image
						src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/5bc3743b-dd12-43b7-b3d6-b28edbaf04af___0032a725c655552677c72b233dfe233b.svg'
						alt='Mapa do brasil'
					/>
				</View>

				<View className='flex flex-col gap-[18px] px-10'>
					<View className='flex items-center justify-center py-[18px] border border-red-700 rounded-lg'>
						<Text className='text-red-700 font-black text-2xl'>20 ESTADOS</Text>
					</View>

					<View className='flex items-center justify-center py-[18px] border border-red-700 rounded-lg'>
						<Text className='text-red-700 font-black text-2xl'>82 CIDADES</Text>
					</View>
					<View className='flex items-center justify-center py-[18px] border border-red-700 rounded-lg'>
						<Text className='text-red-700 font-black text-2xl'>+120 UNIDADES</Text>
					</View>
				</View>
			</View>

			<View className='flex justify-center px-4 pt-12 pb-8'>
				<Image
					src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/6ef0473c-4c68-4b52-9139-24bc10aefee2___f563ca00e1b9df18d5d4d2fafef568a2.png'
					alt='Mulher passando cartão na maquininha'
					className='rounded-3xl'
				/>
			</View>

			<View className='flex flex-col items-center justify-center px-5 gap-4 pb-10'>
				<Text className='text-red-700 text-[32px] font-black'>OMINICHANNEL</Text>

				<Text className='text-center'>
					Qorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a,
					mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut
					interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class
					aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent
					auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac
					rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet
					lacinia. Aliquam in elementum tellus.
				</Text>
			</View>

			<BottomInset />
		</Page>
	)
}
