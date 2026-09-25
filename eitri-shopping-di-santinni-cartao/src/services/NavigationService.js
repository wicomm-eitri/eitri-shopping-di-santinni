import Eitri from 'eitri-bifrost'

export const PAGES = {
	HOME: '/Home',
	SIGNIN: '/SignIn',
	INVOICES: '/Invoices',
	CARD_LIMIT: '/CardLimit',
	LOAN: '/Loan',
	LOAN_AMOUNT: '/LoanAmount',
	LOAN_INSTALLMENTS: '/LoanInstallments',
	LOAN_DETAILS: '/LoanDetails',
	LOAN_BANK: '/LoanBank',
	LOAN_BANK_ACCOUNT: '/LoanBankAccount',
	LOAN_SUMMARY: '/LoanSummary',
	LOAN_TERMS: '/LoanTerms',
	LOAN_BIOMETRICS: '/LoanBiometrics',
	LOAN_IDENTITY: '/LoanIdentity',
	LOAN_COMPLETED: '/LoanCompleted',
	HELP: '/Help',
	MY_INVOICES: '/MyInvoices',
	ANNUITY: '/Annuity',
	MENU: '/Menu',
	PAY_INVOICE: '/PayInvoice',
	MY_LOANS: '/MyLoans',
	MY_CARD: '/MyCard',
	PERSONAL_DATA: '/PersonalData',
	REGISTER_BIOMETRICS: '/RegisterBiometrics',
	REGISTER_IDENTITY: '/RegisterIdentity',
	REGISTER_PERSONAL_DETAILS: '/RegisterPersonalDetails'
}

export const navigate = (page, state = {}, replace = false) => {
	return Eitri.navigation.navigate({ path: page, state, replace })
}

export const goHome = () => {
	Eitri.exposedApis.appState.goHome()
}

export const openMenu = () => navigate(PAGES.MENU)

export const logout = async () => {
	try {
		await Eitri.navigation.backToTop()
		navigate(PAGES.SIGNIN)
	} catch (e) {
		console.error('logout: Error trying to navigate to sign in', e)
	}
}
