import Eitri from 'eitri-bifrost'

// TODO: substituir o mock pela integração real do cartão Di Santinni
const MOCK_DELAY = 800

const REMEMBERED_CPF_KEY = 'cartao-remembered-cpf'

const onlyNumbers = value => (value || '').replace(/\D/g, '')

export const isValidCpf = cpf => onlyNumbers(cpf).length === 11

export const loginCard = async (cpf, password) => {
	await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

	if (!isValidCpf(cpf) || !password) {
		throw new Error('CPF ou senha inválidos')
	}

	return {
		status: 'Success',
		customer: {
			document: onlyNumbers(cpf),
			name: 'Cliente Di Santinni'
		}
	}
}

export const saveRememberedCpf = async cpf => {
	try {
		await Eitri.sharedStorage.setItem(REMEMBERED_CPF_KEY, cpf)
	} catch (e) {
		console.warn('saveRememberedCpf error', e)
	}
}

export const loadRememberedCpf = async () => {
	try {
		return await Eitri.sharedStorage.getItem(REMEMBERED_CPF_KEY)
	} catch (e) {
		console.warn('loadRememberedCpf error', e)

		return null
	}
}

export const clearRememberedCpf = async () => {
	try {
		await Eitri.sharedStorage.removeItem(REMEMBERED_CPF_KEY)
	} catch (e) {
		console.warn('clearRememberedCpf error', e)
	}
}

export const getCardSummary = async () => {
	await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

	return {
		customerName: 'Lucas',
		cardLastDigits: '1234',
		dueDate: '10/10',
		invoiceStatus: 'Aberta',
		bestPurchaseDay: '03/10',
		currentInvoice: 1234.56,
		availableLimit: 2500,
		personalLoanAvailable: 5000,
		doubledLimit: 5000
	}
}
