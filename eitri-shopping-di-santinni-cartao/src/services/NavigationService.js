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
	ANNUITY: '/Annuity'
}

export const navigate = (page, state = {}, replace = false) => {
	return Eitri.navigation.navigate({ path: page, state, replace })
}

export const goHome = () => {
	Eitri.exposedApis.appState.goHome()
}

const ACCOUNT_TAB_INDEX = 4

export const openAccount = async () => {
	try {
		await Eitri.bottomBar.changeTab({ index: ACCOUNT_TAB_INDEX })
	} catch (e) {
		console.error('navigate to account: Error trying to open account', e)
	}
}
