// TODO: substituir o mock pela API de biometria/documentos do cadastro (aguardando o contrato: endpoint, formato do envio e respostas)
const MOCK_DELAY = 800

export const DOCUMENT_TYPES = {
	RG: 'rg',
	CNH: 'cnh'
}

export const validateSelfie = async picture => {
	await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

	if (!picture) {
		throw new Error('Selfie inválida')
	}

	return { status: 'Success' }
}

export const validateDocument = async (documentType, front, back) => {
	await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

	if (!Object.values(DOCUMENT_TYPES).includes(documentType) || !front || !back) {
		throw new Error('Documento inválido')
	}

	return { status: 'Success' }
}
