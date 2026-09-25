export const formatPrice = price => {
	if (typeof price !== 'number') return ''

	return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const formatDate = date => {
	if (!(date instanceof Date)) return ''

	return date.toLocaleDateString('pt-BR')
}

export const maskDocument = document => {
	const digits = (document || '').replace(/\D/g, '')

	if (digits.length !== 11) return ''

	return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`
}

// TODO: definir o total de etapas do cadastro
export const REGISTER_TOTAL_STEPS = 8

const MIN_BIRTH_YEAR = 1900
const MIN_ADULT_AGE = 18

// Recebe a data no formato DD/MM/AAAA e valida se ela existe, não é futura e se a pessoa é maior de idade
export const isValidBirthDate = value => {
	const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value || '')

	if (!match) return false

	const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])]

	if (year < MIN_BIRTH_YEAR) return false

	const birthDate = new Date(year, month - 1, day)

	const exists = birthDate.getFullYear() === year && birthDate.getMonth() === month - 1 && birthDate.getDate() === day

	if (!exists) return false

	const adultDate = new Date(year + MIN_ADULT_AGE, month - 1, day)

	return adultDate <= new Date()
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PHONE_DIGITS = 11

export const isValidEmail = value => EMAIL_REGEX.test((value || '').trim())

// Celular com DDD (11 dígitos), no formato (99) 99999-9999
export const isValidPhone = value => (value || '').replace(/\D/g, '').length === PHONE_DIGITS
