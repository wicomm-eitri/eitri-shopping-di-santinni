import Eitri from 'eitri-bifrost'

export const PAGES = {
	HOME: '/Home',
	SIGNIN: '/SignIn',
	INVOICES: '/Invoices',
	CARD_LIMIT: '/CardLimit',
	LOAN: '/Loan',
	LOAN_AMOUNT: '/LoanAmount',
	LOAN_INSTALLMENTS: '/LoanInstallments',
	HELP: '/Help',
	MY_INVOICES: '/MyInvoices',
	ANNUITY: '/Annuity',
	MENU: '/Menu'
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
