import Eitri from 'eitri-bifrost'

// TODO: substituir o mock pela integração real do cartão Di Santinni
const MOCK_DELAY = 800

const REMEMBERED_CPF_KEY = 'cartao-remembered-cpf'

const SHOW_VALUES_KEY = 'cartao-show-values'

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

export const saveShowValues = async showValues => {
	try {
		await Eitri.sharedStorage.setItem(SHOW_VALUES_KEY, String(showValues))
	} catch (e) {
		console.warn('saveShowValues error', e)
	}
}

export const loadShowValues = async () => {
	try {
		const showValues = await Eitri.sharedStorage.getItem(SHOW_VALUES_KEY)

		return showValues === 'true'
	} catch (e) {
		console.warn('loadShowValues error', e)

		return false
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

export const getCardLimit = async () => {
	await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

	return {
		totalLimit: 1910,
		usedLimit: 206.47,
		doubledLimit: 3820,
		autoLimitIncrease: true
	}
}

// TODO: substituir pela taxa/condições reais retornadas pela API
const MOCK_LOAN_MONTHLY_RATE = 0.035
const LOAN_MAX_INSTALLMENTS = 12

export const getLoanInstallments = async amount => {
	await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

	return Array.from({ length: LOAN_MAX_INSTALLMENTS }, (_, index) => {
		const installments = LOAN_MAX_INSTALLMENTS - index
		const factor = Math.pow(1 + MOCK_LOAN_MONTHLY_RATE, installments)
		const installmentValue = Math.round(((amount * MOCK_LOAN_MONTHLY_RATE * factor) / (factor - 1)) * 100) / 100

		return {
			installments,
			installmentValue,
			totalValue: Math.round(installmentValue * installments * 100) / 100
		}
	})
}

// TODO: substituir pelo retorno real da API de faturas
export const getInvoice = async (year, month) => {
	await new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

	return {
		year,
		month,
		status: 'Fechada',
		totalValue: 108.57,
		dueDate: '10 de Junho',
		maxInstallments: 12,
		installmentValue: 15.94,
		cardholders: [{ name: 'Renata', isHolder: true, totalValue: 108.57 }],
		transactions: [
			{ id: '1', cardholder: 'Renata', description: 'Cartão protegido Di Santinni', date: '28/05', value: 5.17, type: 'service' },
			{ id: '2', cardholder: 'Renata', description: 'Odonto Di Santinni', date: '28/05', value: 25.89, type: 'service' },
			{ id: '3', cardholder: 'Renata', description: 'Di Santinni', date: '28/05', value: 32.64, type: 'purchase' }
		]
	}
}
