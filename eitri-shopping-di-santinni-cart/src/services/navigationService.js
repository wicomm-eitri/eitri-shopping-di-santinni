import Eitri from 'eitri-bifrost'

export const navigateToCheckout = orderFormId => {
	Eitri.nativeNavigation.open({
		slug: 'checkout',
		initParams: { orderFormId }
	})
}

export const navigateToHome = () => {
	Eitri.nativeNavigation.open({
		slug: 'home'
	})
}
