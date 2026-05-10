import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText } from 'eitri-shopping-di-santinni-shared'

export default function AboutUs() {
	return (
		<Page title='Quem Somos'>
			<HeaderContentWrapper>
				<HeaderReturn />

				<HeaderText text='Quem somos' />
			</HeaderContentWrapper>

			<View className='flex flex-col py-5'>
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
			</View>

			<BottomInset />
		</Page>
	)
}
