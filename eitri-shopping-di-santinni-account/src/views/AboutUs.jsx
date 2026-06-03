import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText } from 'eitri-shopping-di-santinni-shared'

export default function AboutUs() {
	const [currentYear, setCurrentYear] = useState('1980')

	return (
		<Page title='Quem Somos'>
			<HeaderContentWrapper>
				<HeaderReturn />

				<HeaderText text='Quem somos' />
			</HeaderContentWrapper>

			<View className='flex flex-col'>
				<Image
					src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/aa72a666-29dd-4e0b-804a-df362e75d3b0___95151c521dd9ee21561e5b5d71cf1d6e.png'
					alt='Imagem com 2 modelos'
				/>

				<View className='flex flex-col gap-4 py-[50px] bg-primary'>
					<View className='flex flex-col gap-4 text-center px-8'>
						<Text className='text-white text-[32px] font-black'>NOSSA MISSÃO</Text>

						<Text className='text-base-100 text-sm'>
							Queremos ser a empresa favorita para quem pensa em qualquer tipo de calçado, nos conectando
							cada vez mais com pessoas, lugares e estilos.Trabalhamos para oferecer a excelência na
							qualidade, variedade e o atendimento para uma compra prazerosa, com o melhor preço e
							facilidade no pagamento com o cartão Di Santinni. Acima de tudo respeitando as leis e
							valores humanos de todos nossos parceiros, profissionais, fornecedores e clientes. Estamos
							aqui para ajudar a expressar seu estilo e ser do jeito que você é.
						</Text>

						<View className='flex flex-col gap-4 mt-4'>
							{[
								'Novidades e ótimo custo benefício',
								'Produtos exclusivos e variedade',
								'Experiência agradável, eficiente e gentil',
								'Inovação com foco na cliente'
							].map((text, index) => (
								<View
									key={index}
									className='bg-base-100 rounded-lg p-6'>
									<Text className='text-primary text-lg font-semibold'>{text}</Text>
								</View>
							))}
						</View>
					</View>

					<View className='flex overflow-x-auto gap-5 mt-10'>
						<Image
							src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/84b7da47-80ad-4273-a2d2-bee6f079fb70___486e80e89b95f5c9547c0dbba99f952e.png'
							alt='Imagem de homem amarrando sapato'
						/>

						<Image
							src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/09ac6bd8-95a9-42dd-8dcf-2ca8e14ba1d6___1bd3e4bd6143d05c659dd916046e6da5.png'
							alt='Imagem de mulher agachada'
						/>
					</View>
				</View>

				<View className='flex flex-col gap-3 pt-8 pb-14'>
					<Text className='text-[32px] text-center'>
						NOSSA <Text className='text-red-700 font-black'>HISTÓRIA</Text>
					</Text>

					<View className='flex overflow-x-auto py-3 gap-12 pl-11 pr-4'>
						{['1980', '1986', '2003', '2010', '2026'].map((year, index) => (
							<View
								key={`${year}-${index}`}
								className='flex items-center gap-3'>
								<Radio
									value={year}
									checked={currentYear === year}
									onChange={e => setCurrentYear(e.target.value)}
									className={`!w-5 !h-5 rounded-full relative !bg-none !bg-transparent checked:before:absolute checked:before:top-1/2 checked:before:left-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-1/2 checked:before:content-[""] checked:before:block checked:before:w-2.5 checked:before:h-2.5 checked:before:bg-red-700 checked:before:rounded-full !border-[1.5px] ${currentYear === year ? '!border-red-700' : '!border-gray-500'}`}
								/>

								<Text className={`text-2xl ${currentYear === year ? 'text-red-700' : 'text-gray-500'}`}>
									{year}
								</Text>
							</View>
						))}
					</View>

					<View className='flex flex-col gap-3 items-center px-5'>
						<Image
							src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/6f21cf61-237c-4650-bb31-bae35cfe0f48___540e51865c999c92bd86e0a254abd737.png'
							alt='Imagem com 2 modelos'
							className='mb-7'
						/>

						<Text className='text-[56px] font-bold'>{currentYear}</Text>

						<View className='flex flex-col gap-4'>
							<Text className='text-lg text-gray-500 text-center px-7'>
								Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit
								interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per
								conubia nostra, per inceptos himenaeos.
							</Text>

							<Text className='text-lg text-gray-500 text-center px-7'>
								Curabitur tempus urna at turpis condimentum lobortis. Ut commodo efficitur neque. Ut
								diam quam, semper iaculis condimentum ac, vestibulum eu nisl.
							</Text>
						</View>
					</View>
				</View>

				<View>
					<Image
						src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/cefc9555-93d4-47f1-ad86-3703556d356f___3c1829a4a1ce4605c392cf03f9001f62.png'
						alt='Imagem com 2 modelos'
						className='w-full'
					/>

					<View className='relative flex flex-col gap-12 items-center pt-20  pb-[90px] px-[70px]'>
						<Image
							src='https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/1a7eac2c-7648-435d-b40c-1dbeb13cd4c9___39d99d76ddfefdc1f3fe65aec2f16398.png'
							alt='Imagem com 2 modelos'
							className='w-[155px] h-auto absolute -top-[77px] left-1/2 -translate-x-1/2'
						/>

						{[
							{
								title: '+45',
								subtitle: 'Corem ipsum dolor sit amet, consectetur adipiscing elit.'
							},
							{
								title: '+2.500',
								subtitle: 'Norem ipsum dolor sit amet, consectetur adipiscing elit.'
							},
							{
								title: '+10MI',
								subtitle: 'Horem ipsum dolor sit amet, consectetur adipiscing elit.'
							}
						].map((item, index) => (
							<View
								key={`${item.title}-${index}`}
								className='flex flex-col items-center'>
								<Text className='text-[52px] font-bold text-red-700'>{item.title}</Text>

								<Text className='text-center text-gray-900'>{item.subtitle}</Text>
							</View>
						))}
					</View>
				</View>

				<View className='flex overflow-x-auto gap-2'>
					{[
						{
							src: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/13019964-c962-43a8-a719-ad4310c47683___a49822cfbd14388c4000e2d68cedfc0f.png',
							alt: 'Imagem 1 do carousel'
						},
						{
							src: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/2dae7924-6518-4a93-98ac-b05109d62668___2227b949b0a8e82024315f7760a3a256.png',
							alt: 'Imagem 2 do carousel'
						},
						{
							src: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/57f5fadb-8ff4-4e94-9aaa-fb5babaa4699___ab3144b64adc7ca2b2bd6e1f1bc288e7.png',
							alt: 'Imagem 3 do carousel'
						},
						{
							src: 'https://disantinni.vtexassets.com/assets/vtex.file-manager-graphql/images/6229b842-38d9-43e3-8b58-adcd3a920ddb___0bc90eea82f61531bde7383b41596743.png',
							alt: 'Imagem 4 do carousel'
						}
					].map((image, index) => (
						<Image
							key={index}
							src={image.src}
							alt={image.alt}
						/>
					))}
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
