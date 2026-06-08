import { useState } from 'react'
import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText } from 'eitri-shopping-di-santinni-shared'
import DuvidasImg from '../assets/images/Duvidas_frequentes.png'

const faqData = [
	{
		category: 'Login e Cadastro',
		questions: [
			{
				q: 'COMO REALIZAR O PRIMEIRO CADASTRO',
				a: 'Clique em cadastre-se na parte superior esquerda do site. Preencha todos os campos solicitados com atenção e verifique se estão corretos antes de confirmar. Super simples 😊! Agora é só navegar e escolher os produtos desejados 👠👜. Aproveite e faça nosso Cartão DS 💳 para garantir descontos em produtos o ano inteiro!'
			},
			{
				q: 'NÃO CONSIGO ACESSAR MINHA CONTA',
				a: 'Envie um e-mail para atendimento@di-santinni.com.br e informe o motivo de não conseguir acessar a sua conta, que vamos verificar internamente e lhe daremos o retorno.'
			},
			{
				q: 'COMO ALTERAR DADOS CADASTRAIS',
				a: 'Para alterar o e-mail ou CPF, envie sua solicitação para atendimento@di-santinni.com.br com o número do CPF e/ou EMAIL cadastrado e anexe a cópia do documento de identificação para confirmação de titularidade. E para alterar os demais dados cadastrais, faça o login em disantinni.com.br/login, acesse a opção MINHA CONTA e edite as informações desejadas.'
			},
			{
				q: 'COMO RECUPERO MINHA SENHA',
				a: 'Para recuperar sua senha, acesse disantinni.com.br/login, digite o seu e-mail de cadastro e clique em CONTINUAR. Na tela seguinte, clique em ESQUECEU A SENHA? confirme as informações na tela, verifique sua caixa de e-mails (ou spam) e siga as instruções para redefinição da senha'
			},
			{
				q: 'COMO EXCLUO O MEU CADASTRO',
				a: 'Para solicitar a exclusão de cadastro, envie um e-mail para atendimento@di-santinni.com.br. O retorno do atendimento será via e-mail.'
			}
		]
	},
	{
		category: 'Como Comprar',
		questions: [
			{
				q: 'COMO COMPRAR NO NOSSO SITE',
				a: 'Para realizar sua primeira compra é simples, basta fazer o seu cadastro, navegar nas categorias e escolher os produtos desejados.'
			},
			{
				q: 'COMO CONSIGO BUSCAR INFORMAÇÕES SOBRE UM PRODUTO',
				a: 'No site:\nRetirada Expressa: você pode consultar o estoque de produtos das lojas pela modalidade de entrega Retirada Expressa.\nDemais opções de entrega: ao selecionar o produto desejado, os tamanhos disponíveis em estoque estarão habilitados para compra.\n\nNAS LOJAS:\nPresencialmente: nossos atendentes terão o prazer lhe ajudar\nRemoto: você poderá consultar o telefone de contato de nossas lojas através do link www.disantinni.com.br/lojas e falar diretamente com um de nossos colaboradores na filial escolhida'
			},
			{
				q: 'O QUE É CARRINHO DE COMPRAS',
				a: 'É a etapa onde se encontra o(s) produto(s) escolhido(s) para compra, nele você confirma as opções do seu pedido, como: tamanho, cor, quantidade, do(s) itens escolhidos. Podendo remover algum produto se necessário. No carrinho também é possível adicionar cupom e calcular o frete e visualizar o valor total da compra.'
			},
			{
				q: 'O PRODUTO QUE EU QUERO NÃO ESTÁ INDISPONÍVEL NO SITE. COMO FAÇO PARA COMPRAR',
				a: 'Se o produto que deseja comprar estiver indisponível no site , você poderá clicar na opção Avise-me quando chegar que assim que houver reposição em nosso estoque iremos enviar um e-mail para você.'
			},
			{
				q: 'COMO FAÇO PARA ADQUIRIR UM CARTÃO PRESENTE',
				a: 'A Di Santinni não comercializa Cartão Presente como meio de pagamento.'
			}
		]
	},
	{
		category: 'Frete e prazo',
		questions: [
			{
				q: 'QUAIS OS TIPOS DE FRETE DISPONÍVEIS',
				a: 'Você quem escolhe a modalidade do frete! 👍🏻\n\nEconomize no frete\n\nRetirar na loja 🏬: retire grátis na loja disponível de sua preferência. O prazo de entrega será informado após a escolha da loja de retirada.\nRetirada Expressa: Escolha uma loja habilitada para esta modalidade e retire o seu pedido em até 3 horas após a confirmação de pagamento.\nFrete a Contratar\n\nReceber em casa 🚚: Realizamos nossas entregas por transportadoras contratadas e Correios. O valor e o prazo da entrega são calculados por região, na página do produto em OPÇÕES DE ENTREGA ou na sacola de compras.'
			},
			{
				q: 'COMO CALCULAR O VALOR E O PRAZO DE ENTREGA',
				a: 'O prazo de entrega é calculado pela soma do prazo de separação do seu pedido em nosso centro logístico e do prazo de entrega informado pela transportadora que realizará a entrega no CEP informado por você.\n\nPara saber o prazo de entrega de um pedido específico, basta acessar à seção MEUS PEDIDOS, dentro de MINHA CONTA e selecionar o pedido que deseja consultar.\n\nAlém disso, logo que você realiza o pedido em nosso site, enviamos um e-mail com todos os dados do seu pedido, incluindo o prazo de entrega e essa informação também estará visível em seu cadastro em nosso site em Meus Pedidos.\n\nLembramos que o prazo é contado a partir do momento que recebemos a confirmação de pagamento de seu pedido, que terá o status atualizado para PAGAMENTO APROVADO.'
			}
		]
	},
	{
		category: 'Formas de Pagamento',
		questions: [
			{
				q: 'PIX',
				a: 'Para pagar via Pix, basta:\n\nSelecionar a opção de pagamento via Pix no checkout e finalizar o pedido.\nEscanear o QR Code ou copiar o código disponível na tela.\nRealizar o pagamento em até 30 minutos após a finalização do pedido.\n\nIMPORTANTE: Se o pagamento não for realizado dentro do prazo informado, o seu pedido será automaticamente cancelado e você deverá refazer a compra.'
			},
			{
				q: 'CARTÃO DE CRÉDITO',
				a: 'Aceitamos as bandeiras: Visa, Mastercard, Elo, Amex e Hipercard. As compras no nosso site podem ser parceladas no cartão de crédito até 5x sem juros, com parcela mínima de R$20,00.\n\nPara selecionar as opções de parcelamento, basta:\n\nPreencher corretamente os dados do cartão, conforme solicitado na etapa de pagamento.\nNão aceitamos outras bandeiras de cartão, exceto as citadas acima.\n\nIMPORTANTE: Verifique se os dados do titular do cartão foram preenchidos corretamente em nosso site e/ou junto a operadora do seu cartão. Pois a falta ou divergência destas informações podem fazer com que o pagamento não seja aprovado.'
			},
			{
				q: 'CARTÃO DI SANTINNI',
				a: 'Compre até 12x fixas com a primeira em até 70 dias para começar a pagar.'
			},
			{
				q: 'VALE COMPRA',
				a: 'O vale-compra é um crédito disponibilizado em razão de uma devolução ou troca do produto/pedido, sendo utilizado como forma de pagamento.\n\nVocê poderá realizar uma nova compra em nosso site, utilizando o código que chegará ao seu e-mail de cadastro.\n\nTemos o compromisso com a sua segurança, por isso o vale-compra é encaminhado de forma automatizada e apenas o titular da compra tem acesso a essa informação.\n\nPara utilizar você deve:\n\nAdicionar o código recebido por e-mail no campo ADICIONAR VALE-COMPRA, dentro do checkout na etapa FORMA DE PAGAMENTO.\n\nIMPORTANTE: O prazo para utilização é de 60 dias corridos, válido exclusivamente em nosso site.'
			}
		]
	},
	{
		category: 'Cartão Di Santinni',
		questions: [
			{
				q: 'COMO FAZER O CARTÃO DI SANTINNI?',
				a: 'Simples, rápido e 100% digital!\n\nFaça o Cartão Di Santinni em uma de nossas lojas físicas, com um documento de identificação ou diretamente pelo APP Cartão Di Santinni. Lá você tem tudo na palma da mão!\n\nApp Store: https://apps.apple.com/br/app/cart%C3%A3o-di-santinni/id1540575373\n\nPlay Store: https://play.google.com/store/apps/details?id=br.com.portaldocartao.cartaodisantinni'
			},
			{
				q: 'DEMAIS INFORMAÇÕES',
				a: 'Para solicitar alteração de:\n\nVencimento\nLimite\nIncluir dependente\n2ª via do cartão\nCancelamento\n\nEntre outras dúvidas, fale com o atendente do Cartão Di Santinni na central exclusiva em https://api.whatsapp.com/send?phone=551140033900'
			}
		]
	}
]

export default function FrequentlyAskedQuestions() {
	const [activeTab, setActiveTab] = useState(faqData[0].category)
	const [expandedIndex, setExpandedIndex] = useState(null)

	const currentQuestions = faqData.find(tab => tab.category === activeTab)?.questions || []

	const toggleAccordion = index => {
		if (expandedIndex === index) {
			setExpandedIndex(null)
		} else {
			setExpandedIndex(index)
		}
	}

	return (
		<Page
			title='Dúvidas Frequentes'
			className='bg-[#F8F8F8]'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text='Dúvidas Frequentes' />
			</HeaderContentWrapper>

			<View className='flex flex-col w-full h-full'>
				{/* Banner Image */}
				<Image
					src={DuvidasImg}
					className='w-full object-cover'
				/>

				{/* Horizontal Scroll Tabs */}
				<View className='flex flex-row overflow-x-auto gap-3 py-4 px-4 whitespace-nowrap '>
					{faqData.map((tab, idx) => (
						<View
							key={idx}
							onClick={() => {
								setActiveTab(tab.category)
								setExpandedIndex(null)
							}}
							className={`px-4 py-2 rounded-md ${
								activeTab === tab.category ? 'bg-gray-50' : 'bg-gray-50'
							}`}>
							<Text
								className={`text-sm font-bold ${
									activeTab === tab.category ? 'text-red-700' : 'text-gray-600'
								}`}>
								{tab.category}
							</Text>
						</View>
					))}
				</View>

				{/* Accordion List */}
				<View className='flex flex-col gap-2 p-4 pb-10'>
					{currentQuestions.map((item, index) => {
						const isExpanded = expandedIndex === index

						return (
							<View
								key={index}
								className='flex flex-col bg-gray-50 rounded-md overflow-hidden'>
								<View
									onClick={() => toggleAccordion(index)}
									className='flex flex-row justify-between items-center p-4 '>
									<Text className='text-xs font-bold text-gray-800 pr-4 uppercase'>{item.q}</Text>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='16'
										height='16'
										viewBox='0 0 24 24'
										fill='none'
										stroke='#4b5563'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
										<polyline points='6 9 12 15 18 9'></polyline>
									</svg>
								</View>

								{isExpanded && (
									<View className='p-4 pt-0'>
										<Text className='text-xs text-gray-600 leading-relaxed whitespace-pre-line'>
											{item.a}
										</Text>
									</View>
								)}
							</View>
						)
					})}
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
