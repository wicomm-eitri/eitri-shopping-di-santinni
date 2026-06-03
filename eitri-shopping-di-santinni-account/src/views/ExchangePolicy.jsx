import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText } from 'eitri-shopping-di-santinni-shared'

function Paragraph({ children }) {
	return <Text className='text-sm text-gray-700'>{children}</Text>
}

function Title({ children }) {
	return <Text className='text-sm font-bold text-gray-900'>{children}</Text>
}

function Section({ title, children }) {
	return (
		<View className='flex flex-col gap-3'>
			<Title>{title}</Title>

			{children}
		</View>
	)
}

function List({ items }) {
	return (
		<View className='flex flex-col gap-1 pl-2'>
			{items.map(item => (
				<Paragraph key={item}>- {item}</Paragraph>
			))}
		</View>
	)
}

export default function ExchangePolicy() {
	return (
		<Page title='ExchangePolicy'>
			<HeaderContentWrapper>
				<HeaderReturn />

				<HeaderText text='Política de Troca' />
			</HeaderContentWrapper>

			<View className='flex flex-col gap-4 px-9 py-5'>
				<Paragraph>
					Ao comprar no site da Di Santinni você conta com toda comodidade e suporte de um pós-venda
					eficiente, se houver a necessidade de efetuar trocas ou devoluções. Segue o passo a passo para que
					você possa realizar a troca ou a devolução do seu produto.
				</Paragraph>

				<Section title='1º Passo – Atendimento, Solicitação de Serviço e Despacho.'>
					<Paragraph>A troca pode ser solicitada através dos nossos canais de atendimento:</Paragraph>

					<Paragraph>Central de atendimento clique aqui</Paragraph>

					<Paragraph>
						Nosso serviço de atendimento ao cliente funciona de segunda à sábado das 09h às 20h. Neste
						atendimento deverá ser especificado o motivo do contato. A solicitação será aceita por um dos
						três motivos: defeito, desistência ou troca da(s) mercadoria(s).
					</Paragraph>

					<Paragraph>Critérios de devoluções por desistência ou troca:</Paragraph>

					<List items={['Cor;', 'Modelo;', 'Numeração.']} />

					<Paragraph>Os critérios para uma troca por defeito de fabricação ser recusada são:</Paragraph>

					<List
						items={[
							'Ausência de defeito (não constatação do dano apontado);',
							'Indícios de uso inadequado do produto;',
							'Indícios de dano acidental;',
							'Desgaste natural em decorrência do uso;',
							'Lavagem inadequada do produto.'
						]}
					/>

					<Paragraph>
						Feito a solicitação e a validação pelo atendente, enviaremos por e-mail a habilitação de
						postagem. Preencha esta habilitação e dirija-se até a agência dos Correios mais próxima e
						entregue o documento de postagem junto com o(s) produto(s) que será(ão) enviado(s) de volta ao
						Centro de Distribuição da Di Santinni.
					</Paragraph>

					<Paragraph>
						Para que sua solicitação seja atendida de forma plena, é importante que as mercadorias estejam
						em suas embalagens originais, completas e embaladas em papel pardo, assim como, determinam os
						Correios. A DANFE (Documento Auxiliar de Nota Fiscal Eletrônica) deverá, obrigatoriamente,
						acompanhar o produto. As mercadorias que não atenderem a essas especificações serão devolvidas
						para o destinatário e não passarão pela avaliação.
					</Paragraph>

					<Paragraph>
						Lembrando que a primeira troca é grátis, ou seja, você não terá custo algum para envio. A
						validade da habilitação é de até 7 (sete) dias contados após o recebimento do formulário. Caso
						necessite trocar mais vezes o mesmo produto, haverá cobrança de frete.
					</Paragraph>
				</Section>

				<Section title='2º Passo - Opções de Ressarcimento'>
					<Paragraph>
						• Cupom de Compra - O Cupom de compra é um código gerado automaticamente onde contém o valor
						igual ao do produto devolvido, permitindo assim, que o cliente efetue uma nova compra no mesmo
						valor pago, apenas digitando o código do cupom no campo específico na finalização do seu pedido.
						Caso o produto selecionado exceda o valor do cupom, o cliente deve efetuar o pagamento da
						diferença optando por um dos meios de pagamentos disponíveis.
					</Paragraph>

					<Paragraph>
						• Estorno - O estorno do valor pago será efetuado da mesma forma como foi realizado o pagamento,
						ou seja, se o pagamento foi realizado por cartão de crédito, o valor será creditado em até duas
						faturas subsequentes.
					</Paragraph>

					<Paragraph>
						Assim que o produto for recebido em nosso centro de distribuição e feita a devida avaliação,
						solicitaremos o cupom de compra ou estorno, conforme o que foi solicitado no primeiro contato em
						nosso atendimento, e este será enviado para o e-mail cadastrado no site Di Santinni.
					</Paragraph>
				</Section>

				<Section title='3º Passo - Prazos'>
					<Paragraph>
						O prazo para conclusão do processo para gerar o cupom ou estorno, depende da chegada do produto
						em nosso Centro de Distribuição. Portanto aconselhamos o envio do produto o quanto antes para
						uma resolução mais rápida.
					</Paragraph>

					<Paragraph>Prazos para solicitação, contados a partir da data de recebimento do produto:</Paragraph>

					<Paragraph>
						Troca: 60 (sessenta) dias | Defeito: 90 (noventa) dias | Devolução: 7 (sete) dias
					</Paragraph>
				</Section>
			</View>

			<BottomInset />
		</Page>
	)
}
